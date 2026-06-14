import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { Router } from "@angular/router";
import { Subscription } from 'rxjs';
import { Product } from '../../../../models/product';
import { ApiService } from '../../../../services/api.service';
import { CartService } from '../../../../services/cart.service';
import { ProductService } from '../../../../services/product.service';
import { ComponentLeftComponent } from '../../component-left/component-left.component';
import { ComponentRightComponent } from '../../component-right/component-right.component';


@Component({
  selector: 'app-carousel-standard',
  imports: [CommonModule, ComponentRightComponent, ComponentLeftComponent],
  templateUrl: './carousel-standard.component.html',
  styleUrl: './carousel-standard.component.scss',
})
export class CarouselStandardComponent implements OnInit {

 private apiService = inject(ApiService);
 private productService = inject(ProductService);
 private router = inject(Router);
 private cartService = inject(CartService);

  // 1. Vos données sources
  allProducts = signal<Product[]>([]); // Votre liste complète
  productsSoldOut = signal<Product[]>([]); // La liste venant du service

  articles: Product[] = [];
  visibleCount = 5;
  currentIndex = 0;
  isAnimating = false;
  direction: 'left' | 'right' = 'right';
  private touchStartX = 0;
  private touchEndX = 0;
  cart$ = this.cartService.items$;
  private subscription: Subscription = new Subscription();


  // 2. Un signal calculé qui combine les deux
  productsWithBadge = computed(() => {
    const soldOutIds = new Set(this.productsSoldOut().map(p => p.id));
    
    return this.allProducts().map(product => ({
      ...product,
      isSoldOut: soldOutIds.has(product.id) // Ajoute une propriété dynamique
    }));
  });

  
  ngOnInit(): void {
    this.loadProducts();
    this.loadProductsSoldOut();
    this.updateVisibleCount();
    window.addEventListener('resize', () => {
      this.updateVisibleCount();
    }); 
    console.log(this.productsWithBadge());
  
  }
  
  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
  
  loadProducts() {
    this.apiService.getProducts().subscribe((p) => {
      this.articles = p;      
      this.allProducts.set(p);
    });
  }

  // ALIMENTE LA LISTE DES SOLDOUT
  loadProductsSoldOut(){
    this.productService.disponibilityProductSoldOut().subscribe(psoldout => {
      this.productsSoldOut.set(psoldout);
    })
  }
  // a retirer en production
fixLocalUrl(url: string): string {
  if (!url) return '';

  // 1. Si l’URL commence par localhost → remplacer
  if (url.startsWith('http://localhost:4200')) {
    return url.replace('http://localhost:4200', 'https://boycote.fr');
  }

  // 2. Si l’URL est relative → préfixer ton domaine
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://boycote.fr/${url.replace(/^\//, '')}`;
  }

  // 3. Sinon on renvoie tel quel
  return url;
}


  // get visibleArticles() {
  //   if (!this.articles || this.articles.length === 0) return [];

  //   const total = this.articles.length;
  //   const count = Math.min(this.visibleCount, total);
  //   const start = this.currentIndex - Math.floor(count / 2);
    
  //   // Création d'un Set pour une recherche rapide en O(1)
  //   const soldOutIds = new Set(this.productsSoldOut().map(p => p.id));

  //   const result = [];
  //   for (let i = 0; i < count; i++) {
  //     const index = (start + i + total) % total;
  //     const article = this.articles[index];
      
  //     // On retourne l'article avec sa propriété "isSoldOut" calculée à la volée
  //     result.push({
  //       ...article,
  //       isSoldOut: soldOutIds.has(article.id)
  //     });

  //           this.fixLocalUrl(article.pathpictureone);
  //   }
  //   return result;
  // }

get visibleArticles() {
  if (!this.articles || this.articles.length === 0) return [];

  const total = this.articles.length;
  const count = Math.min(this.visibleCount, total);
  const start = this.currentIndex - Math.floor(count / 2);

  const soldOutIds = new Set(this.productsSoldOut().map(p => p.id));

  const result = [];

  for (let i = 0; i < count; i++) {
    const index = (start + i + total) % total;
    const article = this.articles[index];

    const fixedUrl = this.fixLocalUrl(article.pathpictureone);

    result.push({
      ...article,
      pathpictureone: fixedUrl,
      isSoldOut: soldOutIds.has(article.id)
    });
  }

  return result;
}


  

  trackByArticle(index: number, article: Product) {
    return article.id ?? index;
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
    if (this.isAnimating) return;
    this.triggerAnimation('right');
    this.currentIndex = (this.currentIndex + 1) % this.articles.length;
  }

  prev() {
    if (this.isAnimating) return;
    this.triggerAnimation('left');
    this.currentIndex =
      (this.currentIndex - 1 + this.articles.length) % this.articles.length;
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

  readViewProduct(product:Product){    
    this.productService.product = product; // Injecte les infos dans ProductService    
    this.router.navigate(['product', product.id]); // Navigue vers la page produit
  }

  // HAND SWIPE MOBILE //
  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.changedTouches[0].clientX;
  }

  onTouchEnd(event: TouchEvent) {
    this.touchEndX = event.changedTouches[0].clientX;
    this.handleSwipe();
  }

  handleSwipe() {
    const delta = this.touchEndX - this.touchStartX;
    if (Math.abs(delta) < 40) return; // seuil minimal
    if (delta < 0) {
      this.next();
    } else {
      this.prev();
    }
  }

  // ADD TO CART 
  addToCart(product: Product) {
  this.cartService.add(product, 1);
  }

  addToRequest(id: number) {   
  this.router.navigate(['/request/',id]);
  }

}
