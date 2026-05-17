import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Garment } from '../models/garment';
import { Gender } from '../models/gender';

@Injectable({
  providedIn: 'root',
})
export class GenderService {

  private http = inject(HttpClient);
  private api = 'https://www.boycoté.fr/api';

    getAll() {
      return this.http.get<Gender[]>(`${this.api}/allGender.php`);
    }
  
    addGender(name: string) {
      return this.http.post(`${this.api}/addGender.php`, { name });
    }

    updateGender(id: number, name: string) {
      return this.http.post(`${this.api}/editGender.php`, { id, name });
    }

    deleteGender(id: number) {
      return this.http.post(`${this.api}/deleteGender.php`, { id });
    }
  
    updateOrderList(orderList: { id: number; order: number }[]) {
    return this.http.post(`${this.api}/update-order-list-gender.php`, orderList);
    }

}
