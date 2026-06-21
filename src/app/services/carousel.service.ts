import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CarouselService {

  carouselMode = signal<'standard' | 'search' | 'select' | 'product'>('standard');

  setMode(mode: 'standard' | 'search' | 'select' | 'product') {
    this.carouselMode.set(mode);
  }

  
}
