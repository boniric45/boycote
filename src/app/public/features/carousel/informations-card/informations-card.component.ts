import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnChanges, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../../../models/product';
import { CartService } from '../../../../services/cart.service';
import { ProductService } from '../../../../services/product.service';


@Component({
  selector: 'app-informations-card',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './informations-card.component.html',
  styleUrl: './informations-card.component.scss',
})
export class InformationsCardComponent implements OnChanges {

  @Input() article!:Product;

  productsSoldOut = signal<Product[]>([]); // La liste venant du service
  articles = signal<any[]>([]);
  afficherMesures = false;

  private productService = inject(ProductService);
  private router = inject(Router);
  private cartService = inject(CartService);

  ngOnChanges() {
    if (!this.article) return;
  }
  
  loadProductsSoldOut() {
    this.productService.disponibilityProductSoldOut().subscribe(psoldout => {
      this.productsSoldOut.set(psoldout);
    })
  }

  addToCart(product: Product) {
    this.cartService.add(product, 1);
  }

    addToRequest(id: number) {
    this.router.navigate(['/request/', id]);
  }

}
