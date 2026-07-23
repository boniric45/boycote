import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/product';
import { ProductService } from './product.service';
import { CookieService } from './cookie.service'; // 👈 Import du CookieService

export interface CartItem {
  product: Product;
  quantity: number;
  total: number;
  soldOut?: boolean;
}

@Injectable({ providedIn: 'root' })
export class CartService {

  private items: CartItem[] = [];
  private productService = inject(ProductService);
  private cookieService = inject(CookieService); // 👈 Injection du service de cookies

  items$ = new BehaviorSubject<CartItem[]>([]);
  count$ = new BehaviorSubject<number>(0);
  private firstOpenDone = false;

  constructor() {
    this.loadFromStorage();   // 🚀 Recharge le panier depuis les cookies au démarrage
  }

  // ------------------------------
  // ADD
  // ------------------------------

  add(product: Product, quantity: number = 1) {

    const existing = this.items.find(i => i.product.id === product.id);

    if (existing) {
      alert("This item is already in your cart.");
      return; 
    }

    this.items.push({
      product,
      quantity,
      total: product.prix * quantity
    });

    this.sync();
  }

  // ------------------------------
  // REMOVE
  // ------------------------------
  remove(productId: number) {
    this.items = this.items.filter(i => i.product.id !== productId);
    this.sync();
  }

  // ------------------------------
  // CLEAR
  // ------------------------------
  clear() {
    this.items = [];
    this.sync();
  }

  // ------------------------------
  // TOTAL
  // ------------------------------
  getTotal() {
    return this.items
      .filter(i => !i.soldOut)
      .reduce((sum, item) => sum + item.total, 0);
  }

  getItems() {
    return [...this.items];
  }

  // ------------------------------
  // SYNC (mise à jour + cookies)
  // ------------------------------
  private sync() {
    this.items$.next([...this.items]);
    this.count$.next(this.items.filter(i => !i.soldOut).length);
    
    // 🛡️ Stockage dans un cookie (SameSite=Lax) résistant aux webviews d'Instagram
    const cartJson = JSON.stringify(this.items);
    this.cookieService.set('boycote_cart', cartJson, 365);
  }

  // ------------------------------
  // LOAD (au démarrage via les cookies)
  // ------------------------------
  private loadFromStorage() {
    const saved = this.cookieService.get('boycote_cart');
    if (saved) {
      try {
        this.items = JSON.parse(saved);
        this.items$.next([...this.items]);
        this.count$.next(this.items.length);
      } catch (e) {
        console.error("Erreur lors de la lecture du panier depuis les cookies", e);
        this.items = [];
      }
    }
  }

  clearOnFirstOpen() {
    if (!this.firstOpenDone) {
      this.clear(); 
      this.firstOpenDone = true;
    }
  }

  refreshDispo() {
    const items = this.getItems();

    this.productService.disponibilityProductSoldOut().subscribe(soldOutProducts => {
      const soldOutIds = soldOutProducts.map(p => p.id);

      const updatedCart = items.map(item => ({
        ...item,
        soldOut: soldOutIds.includes(item.product.id)
      }));

      this.items = updatedCart; 
      this.sync();              
    });
  }

  isCartEmpty(): boolean {
    const availableItems = this.items.filter(i => !i.soldOut);
    return availableItems.length === 0 || this.getTotal() === 0;
  }

  validateCheckout(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const availableItems = this.items.filter(i => !i.soldOut);

    if (availableItems.length === 0) {
      errors.push("Your cart contains no available items.");
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

checkMetadataSize(cartItems: any): boolean {
  const jsonPayload = JSON.stringify(cartItems);
  const size = new Blob([jsonPayload]).size;

  // Stripe autorise jusqu'à 500 caractères pour les metadata. 
  // Avec une simple liste d'IDs, on sera toujours très largement en dessous (ex: 15 octets pour 2 articles).
  if (size > 480) {
    console.error("Warning: The cart metadata is too large for Stripe !");
    return false;
  }
  
  return true;
}
}