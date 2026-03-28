import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-product-card',
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {


  // ✏️ MODIFIE ICI POUR CHAQUE ARTICLE
titre = 'SS99 Comme des Garçons';
description = 'Tattoo mesh sleeveless top\nSheer flesh-tone mesh with blurred yakuza tattoos';
prix = '€ 320';
genre = 'Women';
taille = 'S';
etat = "Excellent — porté 2 fois, aucun défaut visible. Livré avec étiquette d'origine.";
mesures = 'Épaules — 38 cm\nPoitrine — 42 cm\nTaille — 36 cm\nHanches — 40 cm\nLongueur — 62 cm';

afficherMesures = false;

}
