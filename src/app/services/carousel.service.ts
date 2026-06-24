import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CarouselService {

  carouselMode = signal<'standard' | 'search' | 'select' | 'product' | 'cabin' | 'contact'>('standard');

  setMode(mode: 'standard' | 'search' | 'select' | 'product' | 'cabin' | 'contact') {
    
  this.carouselMode.set(mode);

  console.log('Mode >>>> ',this.carouselMode());
  
  }

}
