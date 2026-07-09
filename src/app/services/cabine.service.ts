import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, switchMap, take } from 'rxjs';
import { Cabin } from '../models/cabin';

@Injectable({
  providedIn: 'root',
})
export class CabineService {

  // TODO voir si les take(1) fonctionne

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
    return this.http.get<Cabin[]>(`${this.apiUrl}/getAllCabin.php`).pipe(take(1));
  }

  /* -----------------------------------------------------------
     GET ALL CABIN
  ----------------------------------------------------------- */
  getCabins():Cabin[]{
    this.getCabinPictures().pipe(take(1)).subscribe(res=>{
      this.cabins = res;
    })
    return this.cabins;
  }


  /* -----------------------------------------------------------
     CREATE
  ----------------------------------------------------------- */
  createCabin(cabin: Cabin): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/createCabin.php`, cabin).pipe(take(1));
  }

  /* -----------------------------------------------------------
     UPDATE
  ----------------------------------------------------------- */
  updateCabin(cabin: Cabin): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/updateCabin.php`, cabin).pipe(take(1));
  }


  /* -----------------------------------------------------------
     GET ONE
  ----------------------------------------------------------- */
  getCabinById(id: number): Observable<Cabin> {
    return this.http.get<Cabin>(`${this.apiUrl}/getCabin.php?id=${id}`).pipe(take(1));
  }

  /* -----------------------------------------------------------
     GET ALL
  ----------------------------------------------------------- */
  getAllCabin(): Observable<Cabin[]> {
    return this.http.get<Cabin[]>(`${this.apiUrl}/getAllCabin.php`).pipe(take(1));
  }

  /* -----------------------------------------------------------
     DELETE
  ----------------------------------------------------------- */
  deleteCabin(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/deleteCabin.php?id=${id}`).pipe(take(1));
  }
  
  /* -----------------------------------------------------------
     DELETE IMAGE
  ----------------------------------------------------------- */
  deleteImage(id: number) {
  return this.http.delete(`${this.apiUrl}/deleteCabinImage.php?id=${id}`).pipe(take(1));
}


  /* -----------------------------------------------------------
     GET PICTURE BY CABIN ID RETURN PATH PICTURE 
  ----------------------------------------------------------- */
  getPathPictureByIdCabin(id: number): string {
    let pathCabin = '';
    if (!id) {
      // récupère la cabine
      this.getCabinById(id).subscribe((res) => this.cabin = res)

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

  

