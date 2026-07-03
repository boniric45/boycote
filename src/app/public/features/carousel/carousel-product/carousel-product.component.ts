import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from '../../../../models/product';
import { CarouselService } from '../../../../services/carousel.service';
import { CartService } from '../../../../services/cart.service';
import { LogicProductService } from '../../../../services/logic-product.service';
import { ProductService } from '../../../../services/product.service';
import { ComponentLeftComponent } from '../../component-left/component-left.component';
import { ComponentRightComponent } from '../../component-right/component-right.component';
import { InformationsCardComponent } from '../informations-card/informations-card.component';

@Component({
  selector: 'app-carousel-product',
  imports: [
    CommonModule,
    ComponentRightComponent,
    ComponentLeftComponent,
    InformationsCardComponent
  ],
  templateUrl: './carousel-product.component.html',
  styleUrl: './carousel-product.component.scss',
})
export class CarouselProductComponent {

  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private logicProduct = inject(LogicProductService);
  private subscription: Subscription = new Subscription();
  private carouselService = inject(CarouselService);

  articles = signal<any[]>([]);
  visibleCount = 3;
  currentIndex = 0;
  isAnimating = false;
  direction: 'left' | 'right' = 'right';
  product!: Product;
  private touchStartX = 0;
  private touchEndX = 0;
  isFullscreen = false;

  ngOnInit(): void {

    this.carouselService.setMode('product');
    const id = this.logicProduct.product.id;

    // 1. Charger le produit depuis l’API
    this.productService.getProduct(id).subscribe(res => {

      if (!res.success || !res.product) {
        this.carouselService.setMode('product');
        return;
      }

      // 2. Stocker le produit
      this.product = res.product;
      this.productService.product = res.product;


      // 3. Construire les images
      let imageList = this.productService.buildImageObjects(this.product);

      // 4. Supprimer la première image
      this.articles.set(imageList.slice(1));

      // 5. Initialiser le carousel
      this.visibleCount = this.articles().length;
      this.currentIndex = Math.floor(this.visibleCount / 2);

      // 6. Responsive
      this.updateVisibleCount();
      this.currentIndex = Math.floor(this.visibleCount / 2);

      // 7. Resize listener
      window.addEventListener('resize', () => {
        this.updateVisibleCount();
        this.currentIndex = Math.floor(this.visibleCount / 2);
      });
    });
  }

  ngOnChanges() {
    this.carouselService.setMode('product');
  }

  fixLocalUrl(url: string): string {
    if (!url) return '';

    if (url.startsWith('http://localhost:4200')) {
      return url.replace('http://localhost:4200', 'https://boycote.fr');
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://boycote.fr/${url.replace(/^\//, '')}`;
    }

    return url;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // Zoom la photo 
  fullscreenImage: string | null = null;

  openFullscreen(src: string) {
    this.fullscreenImage = src;
    document.body.style.overflow = 'hidden';
  }

  closeFullscreen() {
    this.fullscreenImage = null;
    document.body.style.overflow = '';
  }

  get visibleArticles() {

    // SI ARTICLES EST VIDE RENVOI []
    if (!this.articles() || this.articles().length === 0) {
      return [];
    }

    const total = this.articles().length;
    const result = [];
    const count = Math.min(this.visibleCount, total);
    const start = (this.currentIndex-1) - Math.floor(count / 2);
    for (let i = 0; i < count; i++) {
      let index = (start + i + total) % total;
      result.push(this.articles()[index]);
    }
    return result;
  }

  trackByArticle(index: number, article: Product) {
    const finalImages = [];
    if (this.articles().length < 10) {
      for (const img in article) {
        finalImages.push(img);
      }
    }
    return article.id ?? index;
  }

  updateVisibleCount() {
    this.visibleCount = 3;  // ✔️ Toujours 3
   // this.visibleCount = window.innerWidth < 768 ? 3 : 5; // suivant la taille de l'écran
  }

  triggerAnimation(dir: 'left' | 'right') {
    this.direction = dir;
    this.isAnimating = true;
    setTimeout(() => (this.isAnimating = false), 180);
  }

  next() {
    if (this.isAnimating) return;
    this.triggerAnimation('right');
    this.currentIndex = (this.currentIndex + 1) % this.articles().length;
  }

  prev() {
    if (this.isAnimating) return;
    this.triggerAnimation('left');
    this.currentIndex = (this.currentIndex - 1 + this.articles().length) % this.articles().length;
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



}
