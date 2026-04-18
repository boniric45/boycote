import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';
import { Marque } from '../models/marque';

@Injectable({ providedIn: 'root' })
export class ApiService {

  private baseUrl = 'https://www.boycoté.fr/api';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/products`);
  }

  getProductDisponibility(id:number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/getDispo.php?id=${id}`); 
  }

  getProduct(id:number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/getProduct?id=${id}`); 
  }

  getMarques(): Observable<Marque[]> {
    return this.http.get<Marque[]>(`${this.baseUrl}/marques.php`);
  }
}
