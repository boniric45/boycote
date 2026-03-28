import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { Product } from '../models/product';
import { ApiService } from './api.service';
import { ModalService } from './modal.service';

export interface CartItem {
  product: Product;
  quantity: number;
  total: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {

  private checkStock: Boolean = false;

  private items: CartItem[] = [];

  private apiService = inject(ApiService);
  private modalService = inject(ModalService);

  items$ = new BehaviorSubject<CartItem[]>([]);

  // Logique métier 
  /* quand il y a un add to card, il faut retirer du stock le produit et 
     passer le stock du produit à 0 seulement si le payement a été accepté

     si il est déjà dans le panier ne pas implémenter le panier
  */


  


  count$ = this.items$.pipe(
  map((items: any[]) => items.reduce((sum, item) => sum + item.quantity, 0))
  );



  add(product: Product, quantity: number = 1) {
    
    // Vérification de la disponibilité du produit
    const existing = this.items.find(i => i.product.id === product.id);

    // if (existing) {
    //   existing.quantity += quantity;
    //   existing.total = existing.quantity * existing.product.ttc;
    // } else {
    //   this.items.push({
    //     product,
    //     quantity,
    //     total: product.ttc * quantity
    //   });
    // }

    this.items$.next(this.items);
  }

  remove(productId: number) {
    this.items = this.items.filter(i => i.product.id !== productId);
    this.items$.next(this.items);
  }

  clear() {
    this.items = [];
    this.items$.next(this.items);
  }

  getTotal() {
    return this.items.reduce((sum, item) => sum + item.total, 0);
  }

  getItems() {
    return this.items;
  }

  getDisponibilityProduct(product: Product):number{
    let stockInBase = 0;
    // recherche le stock du produit
    this.apiService.getProductDisponibility(product.id).subscribe(p => {
      stockInBase = p.stock;
    }
  )
  return stockInBase;
  }
}
