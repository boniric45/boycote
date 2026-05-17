import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Marque } from '../models/marque';

@Injectable({
  providedIn: 'root',
})

export class MarqueService {

  private http = inject(HttpClient);
  private api = 'https://www.boycote.fr/api';

  getMarques():Observable<Marque[]>{
  return this.http.get<Marque[]>(`${this.api}/marques.php`);
  }

  getAll() {
    return this.http.get<Marque[]>(`${this.api}/get.php`);
  }

  addMarque(name: string) {
    return this.http.post(`${this.api}/addMarque.php`, { name });
  }

  updateMarque(id: number, name: string) {
    return this.http.post(`${this.api}/update-marque.php`, { id, name });
  }

  deleteMarque(id: number) {
    return this.http.post(`${this.api}/delete-marque.php`, { id });
  }

  getById(id: number): Observable<Marque> {
    return this.http.get<Marque>(this.api + 'get-marque.php?id=' + id);
  }

  updateOrderList(orderList: { id: number; order: number }[]) {
  return this.http.post(`${this.api}/update-order-list-marque.php`, orderList);
  }

  
}
