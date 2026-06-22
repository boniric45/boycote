import { CommonModule } from '@angular/common';
import { Component, computed, effect, EventEmitter, inject, Input, OnInit, Output, signal, Signal } from '@angular/core';
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
  imports: [CommonModule, CarouselMiniCardComponent, ComponentLeftComponent, ComponentRightComponent],
  templateUrl: './carousel-input.component.html',
  styleUrl: './carousel-input.component.scss',
})
export class CarouselInputComponent {

  private apiService = inject(ApiService);
  private cartService = inject(CartService);
  private productService = inject(ProductService);
  private router = inject(Router);
  private subscription: Subscription = new Subscription();
  logic = inject(LogicInputService);

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  visibleCount = 5;
  currentIndex = 0;
  isAnimating = false;
  direction: 'left' | 'right' = 'right';

  @Output() searchFilters = new EventEmitter<any>();

  @Input() articles: Product[] = [];
  @Input() searchQuery!: string;

  loadingPb: boolean = true;

  constructor() {

    // Responsive
    effect(() => {
      const handler = () => this.logic.visibleCount.set(5);
      window.addEventListener('resize', handler);
      return () => window.removeEventListener('resize', handler);
    });
  }

    ngOnChanges() {
      this.apiService.getProducts().subscribe(p => this.logic.setArticles(p));
      this.productService.disponibilityProductSoldOut().subscribe(s => this.logic.setSoldOut(s));
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

  addToRequest(id: number) {
    this.router.navigate(['/request/', id]);
  }

  readViewProduct(idProduct: number) {
    this.productService.getProduct(idProduct)  // Injecte les infos dans ProductService    
    this.router.navigate(['product', idProduct]); // Navigue vers la page produit
  }



}
