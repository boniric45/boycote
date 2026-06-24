import { Injectable } from '@angular/core';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class LogicProductService {

idProduct : number = 0;
product!: Product;

constructor(){
  this.ngDebugOk();
  console.log(this.idProduct);
  
}

ngDebugOk(){
  console.log('id > ',this.idProduct);
  console.log('Product > ',this.product);
}


  
}
