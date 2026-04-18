import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Marque } from '../models/marque';

@Injectable({
  providedIn: 'root',
})

export class MarqueService {

  private http = inject(HttpClient);
  private api = 'https://www.boycoté.fr/api/';

  getMarques():Observable<Marque[]>{
  return this.http.get<Marque[]>(`${this.api}/marques.php`);
  }

  getAll() {
    return this.http.get<Marque[]>(`${this.api}/get.php`);
  }

  create(marque:Marque) {
    return this.http.post(`${this.api}/create.php?type=marque`, marque);
  }

  delete(id:number) {
    return this.http.get(`${this.api}/delete.php?type=marque&id=${id}`);
  }

  
}
