import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  productCarousel: Product[] = [];

  getPrevProduct(allProducts:Product[],indexImage: number):Product[]{

    while(indexImage%9==0){
      for(var i=indexImage;i<indexImage+9;i++){
        allProducts.forEach((pr) => {
          if(pr.idImage == i){
              this.productCarousel.push(pr);
          }
        })       
      }
    }
    
    return this.productCarousel;
  }

  // Récupère 9 produits de la list produit
  getNumberProduct(products: Product[],nb:number): Product[] {
    let list: Product[] = [];
    products.forEach(p => {
      for(let i=1;i<nb;i++)
        list.push(p);
    })
    list.sort((n1,n2) => n1.id - n2.id); // Tri par ordre croissant
    return list;
  }

  // Récupère le produit par image
  getProductByIdImage(idImage:number){
    return this.http.get<Product>('http://localhost/product/'+idImage);
  }

  getProducts():Observable<Product[]>{
  return this.http.get<Product[]>('http://localhost/products');
  }

  getProductByGender(gender:string):Observable<Product[]>{
  return this.http.get<Product[]>('http://localhost/product/genre/'+gender);
  }

  getProductByMarque(marque:string):Observable<Product[]>{
  return this.http.get<Product[]>('http://localhost/product/marque/'+marque);
  }

  getProductByType(type:string):Observable<Product[]>{
  return this.http.get<Product[]>('http://localhost/product/type/'+type);
  }

}
