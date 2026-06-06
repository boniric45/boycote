import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnChanges, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-card',
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent implements OnInit {
  
  private productService = inject(ProductService);
  @Input() product!:Product;

  protected  titre = '';
  protected  description = '';
  protected  prix = 0;
  protected  condition = '';
  protected  genre = '';
  protected  taille = '';
  protected  mesures = '';
  afficherMesures = false;
  
  ngOnInit(): void {

    this.product = this.productService.product;
    console.log('Product-Card > ',this.product);
    
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



}
