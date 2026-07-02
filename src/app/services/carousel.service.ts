import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root',
})
export class CarouselService {

  constructor(private router: Router) { }

  carouselMode = signal<
    'home' | 'standard' | 'search' | 'select' | 'product' |
    'cabin' | 'contact' | 'notice' | 'return' | 'request'
  >('standard');

  setMode(mode: ReturnType<typeof this.carouselMode>) {
    this.carouselMode.set(mode);

  this.router.navigate([], {
    queryParams: { mode },
    queryParamsHandling: 'merge'
  });
  }

}


