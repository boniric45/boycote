import { Component, inject, OnInit, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';


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
export class CartComponent implements OnInit{

    // URL de ton API OVH PHP — à adapter
  private readonly API = 'https://www.boycoté.fr/api';

  goToCheckout = output<void>();

  cart: CartItem[] = [];
  isOpen = false;

  private http = inject(HttpClient);

  get total(): number {
    return this.cart.reduce((sum, item) => sum + item.prix, 0);
  }

  ngOnInit(): void {
    // Le panier est stocké en localStorage — pas besoin de BDD pour ça
    // La BDD OVH sert uniquement pour les produits et les commandes
    const saved = localStorage.getItem('boycote_cart');
    if (saved) this.cart = JSON.parse(saved);
  }

  // Appelée depuis le parent (carousel, product card, etc.)
  addItem(item: CartItem): void {
    this.cart.push({ ...item, id: Date.now() });
    this.save();
  }

  removeItem(index: number): void {
    this.cart.splice(index, 1);
    this.save();
  }

  openCart():  void { this.isOpen = true;  }
  closeCart(): void { this.isOpen = false; }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('cart-overlay')) {
      this.closeCart();
    }
  }

  // Appelle l'API OVH PHP qui crée la session Stripe et redirige
  checkout(): void {
    if (this.cart.length === 0) return;

    const payload = {
      items: this.cart.map(item => ({
        id:     item.id,
        nom:    item.nom,
        prix:   item.prix,
        taille: item.taille,
        genre:  item.genre,
      }))
    };

    this.http.post<{ url: string }>(`${this.API}/create-checkout.php`, payload)
      .subscribe({
        next: (res) => {
          // Redirige vers Stripe Checkout
          window.location.href = res.url;
        },
        error: (err) => {
          console.error('Erreur checkout:', err);
        }
      });
  }

  private save(): void {
    localStorage.setItem('boycote_cart', JSON.stringify(this.cart));
  }

}
