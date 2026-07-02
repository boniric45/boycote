import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { Cabin } from '../models/cabin';

@Injectable({
  providedIn: 'root',
})
export class LogicProductService {

idProduct : number = 0;
product!: Product;
cabin!:Cabin;
  
}
