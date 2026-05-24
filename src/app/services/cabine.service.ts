import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Cabin } from '../models/cabin';

@Injectable({
  providedIn: 'root',
})
export class CabineService {

  cabins: Cabin[] = [];

  selectedCabin = signal<any | null>(null);

  refreshTrigger = signal<boolean>(false);    // pour déclencher un refresh
  private apiUrl = 'https://www.boycote.fr/api';

  http = inject(HttpClient);

  setCabin(cabin: any) {
    this.selectedCabin.set(cabin);
    console.log('Service > ',this.selectedCabin());
  }

    triggerRefresh() {
    this.refreshTrigger.set(!this.refreshTrigger()); // toggle pour notifier
  }



  getCabinPictures(): Observable<Cabin[]> {
    return this.http.get<Cabin[]>(`${this.apiUrl}/getAllCabin.php`);
  }

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




}

  

