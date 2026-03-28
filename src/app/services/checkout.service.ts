import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CartItem } from './cart.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CheckoutService {

  private baseUrl = 'https://www.boycoté.fr/api';

  constructor(private http: HttpClient) {}

  createCheckoutSession(items: CartItem[]): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(`${this.baseUrl}/checkout`, { items });
  }
}

