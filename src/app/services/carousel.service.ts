import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CarouselService {

  carouselMode = signal<'standard' | 'search' | 'select' | 'product' | 'cabin' | 'contact' | 'notice' | 'return'>('standard');

  setMode(mode: 'standard' | 'search' | 'select' | 'product' | 'cabin' | 'contact' | 'notice' | 'return') {
    
  this.carouselMode.set(mode);

  console.log('Mode >>>> ',this.carouselMode());
  
  }

}
