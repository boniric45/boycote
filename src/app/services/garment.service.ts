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
  private api = 'https://www.boycoté.fr/api/';


  getAll() {
    return this.http.get<Garment[]>(`${this.api}/allGarment.php`);
  }

  create(garment:Garment) {
    return this.http.post(`${this.api}/addGarment.php?type=garment`, garment);
  }

  delete(id:number) {
    return this.http.get(`${this.api}/deleteGarment.php?type=garment&id=${id}`);
  }



  
}
