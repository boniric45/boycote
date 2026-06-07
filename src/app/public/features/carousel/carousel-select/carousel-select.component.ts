import { Component, computed, effect, inject, Input, OnInit, signal, Signal } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { CommonModule } from '@angular/common';
import { ProgressbarComponent } from '../../../progressbar/progressbar.component';
import { ComponentLeftComponent } from '../../component-left/component-left.component';
import { ComponentRightComponent } from '../../component-right/component-right.component';
import { Product } from '../../../../models/product';
import { CartService } from '../../../../services/cart.service';
import { Router } from '@angular/router';
import { ProductService } from '../../../../services/product.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-carousel-select',
  imports: [CommonModule, ComponentRightComponent, ComponentLeftComponent, ProgressbarComponent],
  templateUrl: './carousel-select.component.html',
  styleUrl: './carousel-select.component.scss',
})
export class CarouselSelectComponent implements OnInit {

  articles = signal<any[]>([]);
  productsSoldOut = signal<Product[]>([]); // La liste venant du service

  visibleCount = 5;
  currentIndex = 0;
  isAnimating = false;
  direction: 'left' | 'right' = 'right';

  private subscription: Subscription = new Subscription();

  constructor() {
    effect(() => {
      const data = this.productsSoldOut();
      if (data.length > 0) {
        console.log('Réaction automatique au changement : ', data);
        console.log(this.productsWithBadge());
        // maFonctionDeTraitement(data);
      }
    })
  }


  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // 2. Un signal calculé qui combine les deux
  productsWithBadge = computed(() => {
    const soldOutIds = new Set(this.productsSoldOut().map(p => p.id));

    return this.articles().map(product => ({
      ...product,
      isSoldOut: soldOutIds.has(product.id) // Ajoute une propriété dynamique
    }));
  });

  @Input() filteredArticlesSelected: Product[] = []; // Parent BoycoteComponent will set this
  @Input() loadingPb: boolean = true;

  private cartService = inject(CartService);
  private productService = inject(ProductService);
  private router = inject(Router);

  ngOnInit(): void {
    this.loadProductsSoldOut();
    this.updateVisibleCount();
    window.addEventListener('resize', () => {
      this.updateVisibleCount();
    });
  }

  normalized = computed(() => {
    const list = this.filteredArticlesSelected;

    if (!list || list.length === 0) return [];

    if (list.length < 5) {
      const result = [...list];
      while (result.length < 5) {
        result.push(...list);
      }
      return result.slice(0, 5);
    }

    return list;
  });

  // ALIMENTE LA LISTE DES SOLDOUT
  loadProductsSoldOut() {
    this.productService.disponibilityProductSoldOut().subscribe(psoldout => {
      this.productsSoldOut.set(psoldout);
    })
  }

  get visibleArticles() {
    const articles = this.filteredArticlesSelected;

    if (!articles || articles.length === 0) return [];

    const total = articles.length;
    const count = Math.min(this.visibleCount, total);
    const start = this.currentIndex - Math.floor(count / 2);

    // Création d'un Set pour une recherche rapide en O(1)
    const soldOutIds = new Set(this.productsSoldOut().map(p => p.id));

    const result = [];
    for (let i = 0; i < count; i++) {
      const index = (start + i + total) % total;
      const article = articles[index];

      // On retourne l'article avec sa propriété "isSoldOut" calculée à la volée
      result.push({
        ...article,
        isSoldOut: soldOutIds.has(article.id)
      });
    }
    return result;
  }

  // AFFICHE LE CAROUSEL SEULEMENT SI IL Y A TROIS IMAGES
  canShowCarousel = computed(() => this.filteredArticlesSelected.length >= 3);


  trackByArticle(index: number, article: any) {
    return article?.id ?? index;
  }

  updateVisibleCount() {
    this.visibleCount = window.innerWidth < 768 ? 5 : 5;
  }

  triggerAnimation(dir: 'left' | 'right') {
    this.direction = dir;
    this.isAnimating = true;
    setTimeout(() => (this.isAnimating = false), 180);
  }

  next() {
    const total = this.normalized().length;
    if (total === 0) return;
    this.triggerAnimation('right');
    this.currentIndex = (this.currentIndex + 1) % total;
  }

  prev() {
    const total = this.normalized().length;
    if (total === 0) return;
    this.triggerAnimation('left');
    this.currentIndex = (this.currentIndex - 1 + total) % total;
  }

  getTransform(i: number) {
    const middle = Math.floor(this.visibleCount / 2);
    const offset = i - middle;

    const rotation = offset * 8;
    const scale = 1 - Math.abs(offset) * 0.06;
    const translateX = offset * 80;
    const translateZ = 80 - Math.abs(offset) * 30;

    return `
      perspective(1000px)
      translateX(${translateX}px)
      translateZ(${translateZ}px)
      rotateY(${rotation}deg)
      scale(${scale})
    `;
  }

  getZIndex(i: number) {
    const middle = Math.floor(this.visibleCount / 2);
    return 100 - Math.abs(i - middle);
  }

  get centralArticle() {
    const middle = Math.floor(this.visibleCount / 2);
    return this.visibleArticles[middle];
  }

  getOpacity(i: number) {
    const middle = Math.floor(this.visibleCount / 2);
    const offset = Math.abs(i - middle);
    return 1 - offset * 0.15;
  }

  addToCart(product: Product) {
    this.cartService.add(product, 1);
  }

  addToRequest(id: number) {
    this.router.navigate(['/request/', id]);
  }

  readViewProduct(product: Product) {
    this.productService.product = product; // Injecte les infos dans ProductService    
    this.router.navigate(['product', product.id]); // Navigue vers la page produit
  }


}
