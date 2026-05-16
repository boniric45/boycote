import { Component, computed, inject, OnInit, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../../services/cart.service';


export interface CartItem {
  id: number;
  nom: string;
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

  isCartEmpty = computed(() => this.cartService.getItems().length === 0);

  goToCheckout = output<void>();
  isOpen = false;

  private http = inject(HttpClient);
  private cartService = inject(CartService);

  // 🔥 Panier global réactif
  cart$ = this.cartService.items$;

  // 🔥 Total dynamique
  total = computed(() =>
    this.cartService.getItems().reduce((sum, item) => sum + item.total, 0)
  );

  openCart()  { this.isOpen = true; }
  closeCart() { this.isOpen = false; }

  removeItem(productId: number) {
    this.cartService.remove(productId);
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('cart-overlay')) {
      this.closeCart();
    }
  }

  checkout(): void {
    const items = this.cartService.getItems();   // 🔥 panier réel persistant

    if (items.length === 0) return;

    const payload = {
      items: items.map(item => ({
        id:     item.product.id,
        nom:    item.product.name,
        prix:   item.product.prix,
        taille: item.product.size,
        genre:  item.product.gender,
      }))
    };

    this.http.post<{ url: string }>(`${this.API}/create-checkout.php`, payload)
      .subscribe({
        next: (res) => window.location.href = res.url,
        error: (err) => console.error('Erreur checkout:', err)
      });
  }
}



