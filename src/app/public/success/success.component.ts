import { Component, inject } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { ButtonReturnComponent } from "../features/button-return/button-return.component";
import { CarouselService } from '../../services/carousel.service';

@Component({
  selector: 'app-success',
  imports: [],
  templateUrl: './success.component.html',
  styleUrl: './success.component.scss',
})
export class SuccessComponent {

  private carouselService = inject(CarouselService);

  goToHome() {
    this.carouselService.setMode('standard');
    window.location.href = '/';
  }

  cartService = inject(CartService);

  constructor() {
    this.cartService.clear(); // 🔥 Vide le panier
  }
}
