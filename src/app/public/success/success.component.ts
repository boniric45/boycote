import { Component, inject } from '@angular/core';
import { RouterLink } from "@angular/router";
import { CarouselService } from '../../services/carousel.service';
import { CartService } from '../../services/cart.service';
import { ButtonReturnComponent } from "../../shared/button-return/button-return.component";

@Component({
  selector: 'app-success',
  imports: [ButtonReturnComponent],
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

  ngOnInit() {
    // Le panier doit être vidé uniquement si Stripe confirme le paiement
    this.cartService.clear(); 
  }
  
}
