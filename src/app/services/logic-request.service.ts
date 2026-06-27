import { Injectable, signal } from '@angular/core';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class LogicRequestService {

  selectedProduct = signal<Product | null>(null);

  setSelectedProduct(product: Product) {
    this.selectedProduct.set(product);
  }

  

}
