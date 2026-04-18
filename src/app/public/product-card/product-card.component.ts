import { CommonModule } from '@angular/common';
import { Component, inject, Input, input, OnInit, Signal } from '@angular/core';
import { Product } from '../../models/product';
import { CarouselProductComponent } from '../features/carousel/carousel-product/carousel-product.component';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-card',
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent implements OnInit {
  
  private productService = inject(ProductService);
  product!:Product;

  protected  titre = '';
  protected  description = '';
  protected  prix = 0;
  protected  condition = '';
  protected  genre = '';
  protected  taille = '';
  protected  mesures = '';

  ngOnInit(): void {
    this.product = this.productService.product;
    
    this.titre = this.product.name;
    this.description = this.product.description;
    this.prix = this.product.prix;
    this.condition = this.product.conditions;
    this.genre = this.product.gender;
    this.taille = this.product.size;
    this.mesures = this.product.mesure;
  

  }



  




afficherMesures = false;

}
