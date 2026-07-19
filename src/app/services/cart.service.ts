import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/product';
import { ProductService } from './product.service';

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
  items$ = new BehaviorSubject<CartItem[]>([]);
  count$ = new BehaviorSubject<number>(0);
  private firstOpenDone = false;

  constructor() {
    this.loadFromStorage();   // 🔥 recharge le panier au démarrage
  }

  // ------------------------------
  // ADD
  // ------------------------------

  add(product: Product, quantity: number = 1) {

    const existing = this.items.find(i => i.product.id === product.id);

    // 🔥 Empêcher d'ajouter plusieurs fois le même article
    if (existing) {
      alert("This item is already in your cart.");
      return; // On ne cumule pas, on ne touche pas au panier
    }

    // Sinon on ajoute normalement
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
  // SYNC (mise à jour + stockage)
  // ------------------------------
  private sync() {
    this.items$.next([...this.items]);
    this.count$.next(this.items.filter(i => !i.soldOut).length);   // 🔥 compteur global
    localStorage.setItem('boycote_cart', JSON.stringify(this.items));
  }

  // ------------------------------
  // LOAD (au démarrage)
  // ------------------------------
  private loadFromStorage() {
    const saved = localStorage.getItem('boycote_cart');
    if (saved) {
      this.items = JSON.parse(saved);
      this.items$.next([...this.items]);
      this.count$.next(this.items.length);   // 🔥 recharge le compteur
    }
  }

  clearOnFirstOpen() {
    if (!this.firstOpenDone) {
      this.clear(); // vide le panier
      this.firstOpenDone = true;
    }
  }


  refreshDispo() {
    const items = this.getItems(); // panier

    this.productService.disponibilityProductSoldOut().subscribe(soldOutProducts => {

      const soldOutIds = soldOutProducts.map(p => p.id);

      const updatedCart = items.map(item => ({
        ...item,
        soldOut: soldOutIds.includes(item.product.id)
      }));

      this.items = updatedCart; // 👈 mise à jour interne
      this.sync();              // 👈 mise à jour BehaviorSubject + localStorage
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
  
  // 1. On transforme le panier en JSON comme on le fait en PHP
  const jsonPayload = JSON.stringify(cartItems);
  
  // 2. On vérifie la taille
  const size = new Blob([jsonPayload]).size;
  
  //console.log(`Taille actuelle du panier pour Stripe : ${size} octets`);

  // Stripe limite à 500 caractères (octets), on garde une marge de sécurité
  if (size > 480) {
    console.error(" Warning: The cart is too large for Stripe !");
    return false;
  }
  
  return true;
}

}

