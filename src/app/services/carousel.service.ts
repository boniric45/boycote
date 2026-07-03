import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HamburgerService } from './hamburger.service';


@Injectable({
  providedIn: 'root',
})
export class CarouselService {

  constructor(
    private router: Router,
    private hamburgerService: HamburgerService

  ) { }


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

    // Gestion du hamburger
    const shouldEnableHamburger = (mode === 'home' || mode === 'standard' || mode === 'select' || mode === 'search');

    if (shouldEnableHamburger) {
      this.hamburgerService.enable();
    } else {
      this.hamburgerService.disable();
    }
  }



}


