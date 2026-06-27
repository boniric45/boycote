import { Injectable } from '@angular/core';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class LogicProductService {

idProduct : number = 0;
product!: Product;
  
}
