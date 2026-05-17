import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Marque } from '../models/marque';
import { Garment } from '../models/garment';

@Injectable({
  providedIn: 'root',
})
export class GarmentService {

  private http = inject(HttpClient);
  private api = 'https://www.boycoté.fr/api';


  getAll() {
    return this.http.get<Garment[]>(`${this.api}/allGarment.php`);
  }

  addGarment(name: string) {
    return this.http.post(`${this.api}/addGarment.php`, { name });
  }

  updateGarment(id: number, name: string) {
    return this.http.post(`${this.api}/editGarment.php`, { id, name });
  }

  deleteGarment(id: number) {
    return this.http.post(`${this.api}/deleteGarment.php`, { id });
  }

  

  updateOrderList(orderList: { id: number; order: number }[]) {
    return this.http.post(`${this.api}/update-order-list-garment.php`, orderList);
  }


  
}
