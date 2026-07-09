import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnChanges, signal } from '@angular/core';
import { Product } from '../../../../models/product';
import { CarouselService } from '../../../../services/carousel.service';
import { CartService } from '../../../../services/cart.service';
import { LogicRequestService } from '../../../../services/logic-request.service';
import { ProductService } from '../../../../services/product.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-informations-card',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './informations-card.component.html',
  styleUrl: './informations-card.component.scss',
})
export class InformationsCardComponent implements OnChanges {

  private carouselService = inject(CarouselService);
  private logicRequest = inject(LogicRequestService);

  @Input() article!: Product;

  productsSoldOut = signal<Product[]>([]); // La liste venant du service
  articles = signal<any[]>([]);
  afficherMesures = false;

  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private _subDisponibilityProductSoldOut = Subscription.EMPTY;

  ngOnChanges() {
    if (!this.article) return;
  }

  loadProductsSoldOut() {
    this._subDisponibilityProductSoldOut = this.productService.disponibilityProductSoldOut().subscribe(psoldout => {
      this.productsSoldOut.set(psoldout);
    })
  }

  addToCart(product: Product) {
    this.cartService.add(product, 1);
  }

  addToRequest(product: Product) {
    this.carouselService.setMode('request');
    this.logicRequest.setSelectedProduct(product);
  }

  ngOnDestroy() {
    this._subDisponibilityProductSoldOut.unsubscribe();
  }
}
