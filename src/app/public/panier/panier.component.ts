import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-panier',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './panier.component.html',
  styleUrl: './panier.component.scss',
})
export class PanierComponent {

  i:number = 0;
  fraisLivraison = 4.99;
  codePromo = '';
  reduction = 0;

articles = [
  { nom: 'Sneakers Nike', prix: 89.99, qte: 1, image: "pictures\\Produits\\Marques\\Camper\\1.png" },
  { nom: 'T-shirt Adidas', prix: 29.99, qte: 1, image: "pictures\\Produits\\Marques\\Camper\\4.png" }
];


supprimer(index: number): void {
  this.articles.splice(index, 1);
}

get total(): number {
  return this.articles.reduce((acc, item) => acc + item.prix, 0);
}

appliquerPromo() {
  if (this.codePromo.toLowerCase() === 'eric10') {
    this.reduction = this.total * 0.10;
  } else {
    this.reduction = 0;
  }
}

get totalFinal(): number {
  return this.total - this.reduction + this.fraisLivraison;
}


}
