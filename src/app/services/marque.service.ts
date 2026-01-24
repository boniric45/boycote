import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Marque } from '../models/marque';

@Injectable({
  providedIn: 'root',
})

export class MarqueService {

  private http = inject(HttpClient);

  getMarques():Observable<Marque[]>{
  return this.http.get<Marque[]>('http://localhost/marques');
  }

  
}
