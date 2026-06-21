import { CommonModule } from '@angular/common';
import { Component, effect, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product } from '../../../../models/product';
import { CartService } from '../../../../services/cart.service';
import { LogicSelectService } from '../../../../services/logic-select.service';
import { ProductService } from '../../../../services/product.service';
import { ComponentLeftComponent } from '../../component-left/component-left.component';
import { ComponentRightComponent } from '../../component-right/component-right.component';
import { CarouselMiniCardComponent } from '../carousel-mini-card/carousel-mini-card.component';

@Component({
  selector: 'app-carousel-select',
  imports: [CommonModule, ComponentRightComponent, ComponentLeftComponent, CarouselMiniCardComponent],
  providers: [],
  templateUrl: './carousel-select.component.html',
  styleUrl: './carousel-select.component.scss',
})
export class CarouselSelectComponent implements OnInit {

  productsSoldOut = signal<Product[]>([]); // La liste venant du service

  visibleCount = 5;
  currentIndex = 0;
  isAnimating = false;
  direction: 'left' | 'right' = 'right';

  @Input() articles: Product[] = [];
  
  private cartService = inject(CartService);
  private productService = inject(ProductService);
  private router = inject(Router);
  private subscription: Subscription = new Subscription();
  
  logic = inject(LogicSelectService);

  constructor() {

    // Responsive
    effect(() => {
      const handler = () => this.logic.visibleCount.set(5);
      window.addEventListener('resize', handler);
      return () => window.removeEventListener('resize', handler);
    });
  }

  get visible() { return this.logic.visible(); }


  ngOnInit(): void {
    this.productService.disponibilityProductSoldOut().subscribe(s => this.logic.setSoldOut(s));

  }

  ngOnChanges() {
  // if (this.articles && this.articles.length > 0) {
  //   this.logic.setArticles(this.articles);
  // }
  console.log('SELECT INPUT articles = ', this.articles);
  this.logic.setArticles(this.articles);
  console.log('LOGIC articles = ', this.logic.articles());

}


  trackByArticle(index: number, article: any) {
    return article?.id ?? index;
  }

  updateVisibleCount() {
    this.visibleCount = window.innerWidth < 768 ? 5 : 5;
  }

  next() { this.logic.next(); }
  prev() { this.logic.prev(); }

  getOpacity(i: number) { return this.logic.getOpacity(i); }
  getZIndex(i: number) { return this.logic.getZIndex(i); }


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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
