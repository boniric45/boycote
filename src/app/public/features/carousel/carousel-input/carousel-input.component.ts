import { CommonModule } from '@angular/common';
import { Component, effect, EventEmitter, inject, Input, Output } from '@angular/core';
import { Product } from '../../../../models/product';
import { CarouselService } from '../../../../services/carousel.service';
import { CartService } from '../../../../services/cart.service';
import { LogicInputService } from '../../../../services/logic-input.service';
import { LogicProductService } from '../../../../services/logic-product.service';
import { LogicRequestService } from '../../../../services/logic-request.service';
import { ComponentLeftComponent } from '../../component-left/component-left.component';
import { ComponentRightComponent } from '../../component-right/component-right.component';
import { CarouselMiniCardComponent } from "../carousel-mini-card/carousel-mini-card.component";

@Component({
  selector: 'app-carousel-input',
  imports: [CommonModule, CarouselMiniCardComponent, ComponentLeftComponent, ComponentRightComponent],
  templateUrl: './carousel-input.component.html',
  styleUrl: './carousel-input.component.scss',
})
export class CarouselInputComponent {

  private cartService = inject(CartService);
  private carouselService = inject(CarouselService);
  private logicRequest = inject(LogicRequestService);
  logic = inject(LogicInputService);
  private logicProduct = inject(LogicProductService);
  private touchStartX = 0;
  private touchEndX = 0;

  visibleCount = 3;
  currentIndex = 0;
  isAnimating = false;
  direction: 'left' | 'right' = 'right';

  @Output() searchFilters = new EventEmitter<any>();

  @Input() articles: Product[] = [];
  @Input() searchQuery!: string;

  loading: boolean = true;


  constructor() {
    // Responsive
    effect(() => {
      const handler = () => this.logic.visibleCount.set(5);
      window.addEventListener('resize', handler);
      return () => window.removeEventListener('resize', handler);
    });
  }

  ngOnChanges() {
    if (this.articles && this.articles.length > 0) {
      this.loading = false;
    }
  }

  // Exposition des données
  get visible() {
    const v = this.logic.visible();
    return v;
  }

  get central() { return this.logic.central(); }

  next() { this.logic.next(); }
  prev() { this.logic.prev(); }


  getOpacity(i: number) { return this.logic.getOpacity(i); }
  getZIndex(i: number) { return this.logic.getZIndex(i); }

  trackByArticle(index: number, article: any) {
    return article?.id ?? index;
  }

  addToCart(product: Product) {
    this.cartService.add(product, 1);
  }

  addToRequest(product: Product) {
    this.carouselService.setMode('request');
    this.logicRequest.setSelectedProduct(product);
  }

  readViewProduct(product: Product) {
    this.carouselService.setMode('product')
    this.logicProduct.product = product;
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

}
