import { CommonModule } from '@angular/common';
import { Component, computed, inject, Input, OnChanges, OnInit, signal } from '@angular/core';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-card',
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent implements OnInit {

  productsSoldOut = signal<Product[]>([]); // La liste venant du service
  articles = signal<any[]>([]);

  private productService = inject(ProductService);

  product!:Product;

    titre = '';
    description = '';
    prix = 0;
    condition = '';
    genre = '';
    taille = '';
    mesures = '';
    afficherMesures = false;
    private router = inject(Router);
    private cartService = inject(CartService);
  
  ngOnInit(): void {
    this.product = this.productService.product;
    this.titre = this.product?.name;
    this.description = this.product?.description;
    this.prix = this.product?.prix;
    this.condition = this.product?.conditions;
    this.genre = this.product?.gender;
    this.taille = this.product?.size;
    this.mesures = this.product?.mesure;
  }

  ngOnChanges() {
  this.product = this.productService.product;
  console.log('Product-Card On Change > ',this.product);
  this.titre = this.product.name;
  this.description = this.product.description;
  this.prix = this.product.prix;
  this.condition = this.product.conditions;
  this.genre = this.product.gender;
  this.taille = this.product.size;
  this.mesures = this.product.mesure;
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
