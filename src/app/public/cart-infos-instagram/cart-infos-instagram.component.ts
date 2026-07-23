import { Component } from '@angular/core';

@Component({
  selector: 'app-cart-infos-instagram',
  imports: [],
  templateUrl: './cart-infos-instagram.component.html',
  styleUrl: './cart-infos-instagram.component.scss',
})
export class CartInfosInstagramComponent {

  closeCart() { this.isOpen = false; }
  isOpen = false;

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('cart-overlay')) {
      this.closeCart();
    }
  }

  isInstagram(): boolean {
    const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
    return /Instagram/i.test(ua);
  }

}
