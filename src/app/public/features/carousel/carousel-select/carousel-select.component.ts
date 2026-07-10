import { CommonModule } from '@angular/common';
import { Component, effect, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../../../models/product';
import { CarouselService } from '../../../../services/carousel.service';
import { CartService } from '../../../../services/cart.service';
import { LogicProductService } from '../../../../services/logic-product.service';
import { LogicSelectService } from '../../../../services/logic-select.service';
import { ComponentLeftComponent } from '../../component-left/component-left.component';
import { ComponentRightComponent } from '../../component-right/component-right.component';
import { CarouselMiniCardComponent } from '../carousel-mini-card/carousel-mini-card.component';
import { LogicRequestService } from '../../../../services/logic-request.service';

@Component({
  selector: 'app-carousel-select',
  imports: [CommonModule, ComponentRightComponent, ComponentLeftComponent, CarouselMiniCardComponent],
  providers: [],
  templateUrl: './carousel-select.component.html',
  styleUrl: './carousel-select.component.scss',
})
export class CarouselSelectComponent {

  visibleCount = 3; // Nombre de vignette affichée
  currentIndex = 0;
  isAnimating = false;
  direction: 'left' | 'right' = 'right';

  @Input() articles: Product[] = [];

  private cartService = inject(CartService);
  private carouselService = inject(CarouselService);
  private logicRequest = inject(LogicRequestService);
  private logicProduct = inject(LogicProductService);
  logic = inject(LogicSelectService);

  constructor() {

    // Responsive
    effect(() => {
      const handler = () => this.logic.visibleCount.set(this.visibleCount);
      window.addEventListener('resize', handler);
      return () => window.removeEventListener('resize', handler);
    });
  }

  get visible() { return this.logic.visible(); }

  trackByArticle(index: number, article: any) {
    return article?.id ?? index;
  }

  next() { this.logic.next(); }
  prev() { this.logic.prev(); }

  getOpacity(i: number) { return this.logic.getOpacity(i); }
  getZIndex(i: number) { return this.logic.getZIndex(i); }


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

}
