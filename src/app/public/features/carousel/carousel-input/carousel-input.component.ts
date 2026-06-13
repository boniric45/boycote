import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, Input, OnInit, signal, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product } from '../../../../models/product';
import { ApiService } from '../../../../services/api.service';
import { CartService } from '../../../../services/cart.service';
import { LogicInputService } from '../../../../services/logic-input.service';
import { ProductService } from '../../../../services/product.service';
import { ProgressbarComponent } from "../../../progressbar/progressbar.component";
import { ComponentLeftComponent } from '../../component-left/component-left.component';
import { ComponentRightComponent } from '../../component-right/component-right.component';
import { CarouselMiniCardComponent } from "../carousel-mini-card/carousel-mini-card.component";

@Component({
  selector: 'app-carousel-input',
  imports: [CommonModule, ComponentRightComponent, ComponentLeftComponent, ProgressbarComponent, CarouselMiniCardComponent],
  providers: [LogicInputService],
  templateUrl: './carousel-input.component.html',
  styleUrl: './carousel-input.component.scss',
})
export class CarouselInputComponent implements OnInit {

  private apiService = inject(ApiService);
  private cartService = inject(CartService);
  private productService = inject(ProductService);
  private router = inject(Router);
  private subscription: Subscription = new Subscription();
  logic = inject(LogicInputService);

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  articles = signal<any[]>([]);
  productsSoldOut = signal<Product[]>([]); // La liste venant du service

  visibleCount = 5;
  currentIndex = 0;
  isAnimating = false;
  direction: 'left' | 'right' = 'right';


  @Input({ required: true }) searchQuery!: Signal<string>;
  @Input() searchSubmitted!: Signal<boolean>;

  loadingPb: boolean = true;

  constructor() {
    effect(() => {
      const data = this.productsSoldOut();
      if (data.length > 0) {
        console.log('Réaction automatique au changement : ', data);
        console.log(this.productsWithBadge());
        // maFonctionDeTraitement(data);
      }
    })

    effect(() => {
      this.logic.setSearch(this.searchQuery());
    });


  }

  ngOnInit(): void {
    this.apiService.getProducts().subscribe(p => this.logic.setArticles(p));
    this.productService.disponibilityProductSoldOut().subscribe(s => this.logic.setSoldOut(s));

    this.updateVisibleCount();

    window.addEventListener('resize', () => {
      this.updateVisibleCount();
    });
  }

  // RECHERCHE DES PRODUITS
  filtered = computed(() => {
    const term = this.searchQuery().trim().toLowerCase();

    // 🔥 Si aucune recherche → aucun résultat
    if (!term) return [];
    return this.articles().filter(p =>
      p.marque.toLowerCase().includes(term)
    );
  });

  // 2. Un signal calculé qui combine les deux
  productsWithBadge = computed(() => {
    const soldOutIds = new Set(this.productsSoldOut().map(p => p.id));

    return this.articles().map(product => ({
      ...product,
      isSoldOut: soldOutIds.has(product.id) // Ajoute une propriété dynamique
    }));
  });


  // AFFICHE LE CAROUSEL SEULEMENT SI IL Y A TROIS IMAGES
  // canShowCarousel = computed(() => this.filtered().length >= 3);

  normalized = computed(() => {
    const list = this.filtered();

    // Aucun résultat → tableau vide
    if (list.length === 0) {
      return [];
    }

    // Moins de 5 résultats → duplication
    if (list.length < 5) {
      const result = [...list];
      while (result.length < 5) {
        result.push(...list);
      }
      return result.slice(0, 5);
    }

    // Sinon → liste normale
    return list;
  });

  get visibleArticles() { return this.logic.visible(); }

  get showCarousel() { return this.logic.canShowCarousel(); }


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


  // next() {
  //   const total = this.normalized().length;
  //   if (total === 0) return;
  //   this.currentIndex = (this.currentIndex + 1) % total;
  // }

  // prev() {
  //   const total = this.normalized().length;
  //   if (total === 0) return;
  //   this.currentIndex = (this.currentIndex - 1 + total) % total;
  // }

  next() { this.logic.next(); }
  prev() { this.logic.prev(); }

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


  readViewProduct(idProduct: number) {
    this.productService.getProduct(idProduct)  // Injecte les infos dans ProductService    
    this.router.navigate(['product', idProduct]); // Navigue vers la page produit
  }

}
