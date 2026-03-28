import { Component } from '@angular/core';
import { CartService, CartItem } from '../../services/cart.service';
import { CheckoutService } from '../../services/checkout.service';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent {

    items: CartItem[] = [];
  total = 0;

  constructor(
    private cart: CartService,
    private checkout: CheckoutService
  ) {
    this.cart.items$.subscribe(items => {
      this.items = items;
      this.total = this.cart.getTotal();
    });
  }

  remove(id: number) {
    this.cart.remove(id);
  }

  checkoutStripe() {
    this.checkout.createCheckoutSession(this.items).subscribe(res => {
      window.location.href = `https://checkout.stripe.com/pay/${res.id}`;
    });
  }

}
