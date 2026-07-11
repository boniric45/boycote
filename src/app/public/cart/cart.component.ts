import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CarouselService } from '../../services/carousel.service';
import { ProductService } from '../../services/product.service';


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
  cart$ = this.cartService.items$;
  private productService = inject(ProductService);

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
        id: item.product.id,
        nom: item.product.name,
        sku: item.product.sku,
        prix: item.product.prix,
        image: item.product.pathpictureone
      }))
    };

    this.http.post<{ url: string }>(
      `${this.API}/create-checkout.php`,
      payload,
      { withCredentials: true }
    )
      .subscribe({
        next: (res) => {
          if (res?.url) {
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


  openCart() { this.isOpen = true; }
  closeCart() { this.isOpen = false; }
  isOpen = false;

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('cart-overlay')) {
      this.closeCart();
    }
  }

}







