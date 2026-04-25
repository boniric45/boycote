import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Garment } from '../models/garment';
import { Gender } from '../models/gender';

@Injectable({
  providedIn: 'root',
})
export class GenderService {

  private http = inject(HttpClient);
  private api = 'https://www.boycoté.fr/api/';

    getAll() {
      return this.http.get<Gender[]>(`${this.api}/allGender.php`);
    }
  
    create(gender:Gender) {
      return this.http.post(`${this.api}/addGender.php?type=gender`, gender);
    }
  
    delete(id:number) {
      return this.http.get(`${this.api}/deleteGender.php?type=gender&id=${id}`);
    }
  
  
}
