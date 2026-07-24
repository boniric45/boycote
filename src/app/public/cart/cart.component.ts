import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Product } from '../../models/product';
import { CarouselService } from '../../services/carousel.service';
import { CartService } from '../../services/cart.service';
import { LogicProductService } from '../../services/logic-product.service';


export interface CartItem {
  id: number;
  nom: string;
  sku: string;
  taille: string;
  genre: string;
  prix: number;
  image?: string;
}

@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})

export class CartComponent {

  private readonly API = 'https://boycote.fr/api';
  private http = inject(HttpClient);
  private cartService = inject(CartService);
  private carouselService = inject(CarouselService);
  private logicProduct = inject(LogicProductService);

  cart$ = this.cartService.items$;
  product!: Product;

  ngOnInit() {
    this.cartService.refreshDispo();
  }

  onClickGTC() {
    this.carouselService.setMode('notice');
    this.closeCart();
  }


  // 🔥 Total dynamique (recalculé automatiquement)
  get total() {
    return this.cartService.getTotal();
  }

  // 🔥 Panier vide ?
  get isCartEmpty() {
    return this.cartService.isCartEmpty();
  }

  readProduct(product: Product) {
    if (this.carouselService.carouselMode() === 'product') {
      this.carouselService.setMode('standard');
      setTimeout(() => {
        this.logicProduct.product = product;
        this.carouselService.setMode('product');
        this.closeCart();
      }, 50);

    } else {
      this.carouselService.setMode('product');
      this.logicProduct.product = product;
      this.closeCart();
    }
  }


  removeItem(productId: number) {
    this.cartService.remove(productId);
  }

  checkout(): void {
    const validation = this.cartService.validateCheckout();

    if (!validation.valid) {
      alert(validation.errors.join("\n"));
      return;
    }

    const items = this.cartService.getItems().filter(i => !i.soldOut);
    const payload = {
      items: items.map(item => ({
        i: item.product.id
      }))
    };

    if (!this.cartService.checkMetadataSize(payload.items)) {
      alert("Your cart is too large to be processed in a single transaction.");
      return;
    }

    // 🚀 Appel API pour récupérer l'URL Stripe, puis redirection anti-blocage Instagram
    this.http.post<{ url: string }>(
      `${this.API}/create-checkout.php`,
      payload,
      { withCredentials: true }
    )
      .subscribe({
        next: (res) => {
          if (res?.url) {
            // Astuce ultime WebView Instagram : Création et soumission d'un formulaire furtif
            // Cela force le conteneur à accepter la redirection externe vers Stripe
            const form = document.createElement('form');
            form.method = 'GET';
            form.action = res.url;
            document.body.appendChild(form);
            form.submit();
          }
        },
        error: (err) => {
          console.error('Erreur checkout:', err);
          alert("An error occurred while redirecting to Stripe.");
        }
      });
  }

  openCart() { this.isOpen = true; }
  closeCart() { this.isOpen = false; }
  isOpen = false;

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('cart-overlay')) {
      this.closeCart();
    }
  }

  isInstagram(): boolean {
    const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
    return /Instagram|FBAN|FBAV/i.test(ua); // Ajout de FBAN/FBAV pour cibler aussi Facebook si besoin
  }

}







