import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CarouselService {

  carouselMode = signal<
  'home'|
  'standard'|
   'search' | 
   'select' | 
   'product' | 
   'cabin' | 
   'contact' | 
   'notice' | 
   'return' | 
   'request'>('standard');

  setMode(mode: 
    'home' |
    'standard' | 
    'search' | 
    'select' | 
    'product' | 
    'cabin' | 
    'contact' | 
    'notice' | 
    'return' | 
    'request') {
    
  this.carouselMode.set(mode);
  
  }

}
