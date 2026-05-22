import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, output } from '@angular/core';
import { CartService } from '../../services/cart.service';


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

  cart$ = this.cartService.items$;

  // 🔥 Total dynamique (recalculé automatiquement)
  get total() {
    return this.cartService.getTotal();
  }

  // 🔥 Panier vide ?
  get isCartEmpty() {
    return this.cartService.getItems().length === 0;
  }

  removeItem(productId: number) {
    this.cartService.remove(productId);
  }

  checkout(): void {
    const items = this.cartService.getItems();
    if (items.length === 0) return;

    const payload = {
      items: items.map(item => ({
        id: item.product.id,
        nom: item.product.name,
        sku: item.product.sku,
        prix: item.product.prix,
        image: item.product.pathpictureone
      }))
    };

    // this.http.post<{ url: string }>( 
    //   `${this.API}/create-checkout.php`,
    //   payload,
    //   { withCredentials: true } // important pour iOS
    // )
    //   .subscribe({
    //     next: (res) => {
    //       if (res?.url) {
    //         // iOS a besoin d'un "user gesture" → petit timeout
    //         setTimeout(() => {
    //           window.location.href = res.url;
    //         }, 10);
    //       }
    //     },
    //     error: (err) => {
    //       console.error('Erreur checkout:', err);
    //     }
    //   });

    // Bonne pratique Stripe et Widows open mieux accepter par IOS
    this.http.post<{ url: string }>(
      `${this.API}/create-checkout.php`,
      payload,
      { withCredentials: true }
    )
      .subscribe({
        next: (res) => {
          if (res?.url) {
            // Méthode la plus fiable sur iOS
            setTimeout(() => {
              window.open(res.url, '_self');
            }, 0);
          }
        },
        error: (err) => {
          console.error('Erreur checkout:', err);
        }
      });

  }

  openCart()  { this.isOpen = true; }
  closeCart() { this.isOpen = false; }
  isOpen = false;

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('cart-overlay')) {
      this.closeCart();
    }
  }
}







