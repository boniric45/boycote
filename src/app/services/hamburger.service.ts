import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HamburgerService {


  isHamburgerActive: boolean = true;
  isEnabled = signal(true);

  enable() {
    this.isEnabled.set(true);
  }

  disable() {
    this.isEnabled.set(false);
  }


}
