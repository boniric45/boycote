import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { Cabin } from '../models/cabin';

@Injectable({
  providedIn: 'root',
})
export class CabineService {

  cabins: Cabin[] = [];
  cabin!: Cabin;
  private apiUrl = 'https://www.boycote.fr/api';
  http = inject(HttpClient);

  x = signal(0);
  y = signal(0);
  w = signal(0);
  h = signal(0);
  z = signal(0);
  picture = signal('');

  getCabinPictures(): Observable<Cabin[]> {
    return this.http.get<Cabin[]>(`${this.apiUrl}/getAllCabin.php`);
  }

  /* -----------------------------------------------------------
     GET ALL CABIN
  ----------------------------------------------------------- */
  getCabins():Cabin[]{
    this.getCabinPictures().subscribe(res=>{
      this.cabins = res;
    })
    return this.cabins;
  }


  /* -----------------------------------------------------------
     CREATE
  ----------------------------------------------------------- */
  createCabin(cabin: Cabin): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/createCabin.php`, cabin);
  }

  /* -----------------------------------------------------------
     UPDATE
  ----------------------------------------------------------- */
  updateCabin(cabin: Cabin): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/updateCabin.php`, cabin);
  }


  /* -----------------------------------------------------------
     GET ONE
  ----------------------------------------------------------- */
  getCabinById(id: number): Observable<Cabin> {
    return this.http.get<Cabin>(`${this.apiUrl}/getCabin.php?id=${id}`);
  }

  /* -----------------------------------------------------------
     GET ALL
  ----------------------------------------------------------- */
  getAllCabin(): Observable<Cabin[]> {
    return this.http.get<Cabin[]>(`${this.apiUrl}/getAllCabin.php`);
  }

  /* -----------------------------------------------------------
     DELETE
  ----------------------------------------------------------- */
  deleteCabin(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/deleteCabin.php?id=${id}`);
  }
  
  /* -----------------------------------------------------------
     DELETE IMAGE
  ----------------------------------------------------------- */
  deleteImage(id: number) {
  return this.http.delete(`${this.apiUrl}/deleteCabinImage.php?id=${id}`);
}


  /* -----------------------------------------------------------
     GET PICTURE BY CABIN ID RETURN PATH PICTURE 
  ----------------------------------------------------------- */
  getPathPictureByIdCabin(id: number): string {
    let pathCabin = '';
    if (!id) {
      // récupère la cabine
      this.getCabinById(id).subscribe((res) => this.cabin = res);

      // récupère le chemin de l'image en itérant sur l'objet cabin
      Object.entries(this.cabin).forEach(([key, value]) => {
        if (`${key}` == 'picturecabin') {
          pathCabin = `${value}`;
        }
      });
    }
    return pathCabin;
  }

  
  /* -----------------------------------------------------------
     GET PICTURE BY CABIN ID RETURN OBJECT CABIN
  ----------------------------------------------------------- */
  getCabinByIdCabinObject(id: number): Cabin {
  
    if (!id) {
      // récupère la cabine
      this.getCabinById(id).subscribe((res) => this.cabin = res);
    }
    return this.cabin;
  }

}

  

