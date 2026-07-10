import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HamburgerService {


  isHamburgerActive: boolean = true;
  isEnabled = signal(true);

  enable() {
    console.log('Vray',this.isEnabled());

    this.isEnabled.set(true);
  }

  disable() {
    console.log(this.isEnabled());

    this.isEnabled.set(false);
  }


}
