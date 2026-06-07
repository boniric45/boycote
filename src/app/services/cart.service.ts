import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/product';

export interface CartItem {
  product: Product;
  quantity: number;
  total: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {

  private items: CartItem[] = [];

  items$ = new BehaviorSubject<CartItem[]>([]);
  count$ = new BehaviorSubject<number>(0);

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
    return this.items.reduce((sum, item) => sum + item.total, 0);
  }

  getItems() {
    return [...this.items];
  }

  // ------------------------------
  // SYNC (mise à jour + stockage)
  // ------------------------------
  private sync() {
    this.items$.next([...this.items]);
    this.count$.next(this.items.length);   // 🔥 compteur global
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
  
}

