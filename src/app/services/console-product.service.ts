import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Product } from '../models/product';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConsoleProductService {

  private api = 'https://www.boycoté.fr/api';
  private http = inject(HttpClient);
  product!:Product;

  getProducts(){
    return this.http.get<Product[]>(`${this.api}/products.php`);
  }

  getAll() {
    return this.http.get<Product[]>(`${this.api}/get.php?type=product`);
  }

  getById(id:number) {
    return this.http.get<Product>(`${this.api}/get.php?type=product&id=${id}`);
  }

  create(product:Product) {
    return this.http.post<{ success: boolean; message: string; id?: number }>(`${this.api}/create.php?type=product`,product);
  }

  update(product: Product) {
    return this.http.post<{ success: boolean; message: string; id?: number }>(
      `${this.api}/update.php?type=product&id=${product.id}`,
      product,
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }



updateProduct(product: any, pictures: File[], cabine: File | null) {
  const formData = new FormData();

  formData.append('id', product.id);
  formData.append('sku', product.sku);
  formData.append('nom', product.nom);
  formData.append('marque', product.marque);
  formData.append('prix', product.prix);
  formData.append('stock', product.stock);

  // Images 1 → 10
  pictures.forEach((file, index) => {
    if (file) {
      formData.append('picture' + (index + 1), file);
    }
  });

  // Cabine
  if (cabine) {
    formData.append('cabine', cabine);
  }

  return this.http.post('https://www.boycote.fr/api/update.php', formData);
}




deleteProductById(id: number) {
  const formData = new FormData();
  formData.append('id', id.toString());
 return this.http.post('https://www.boycote.fr/api/delete.php', formData);
}

  
}
