import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-success',
  imports: [RouterLink],
  templateUrl: './success.component.html',
  styleUrl: './success.component.scss',
})
export class SuccessComponent {

  cartService = inject(CartService);

  constructor() {
    this.cartService.clear(); // 🔥 Vide le panier
  }
}
