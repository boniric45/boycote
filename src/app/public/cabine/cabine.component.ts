import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { forkJoin } from 'rxjs';
import { Cabin } from "../../models/cabin";
import { Garment } from "../../models/garment";
import { Product } from "../../models/product";
import { CabineService } from "../../services/cabine.service";
import { GarmentService } from "../../services/garment.service";
import { ProductService } from "../../services/product.service";
import { CloseButtonComponent } from "../../shared/close-button/close-button.component";
import { CarouselService } from "../../services/carousel.service";

type Cat = 'chapeau' | 'haut' | 'bas' | 'chaussures';

const mapCat: Record<Cat, string> = {
  haut: 'Tops',
  bas: 'Bottoms',
  chapeau: 'Headwear',
  chaussures: 'Footwear'
};

@Component({
  selector: 'app-cabine',
  standalone: true,
  imports: [RouterModule, CommonModule, CloseButtonComponent],
  templateUrl: './cabine.component.html',
  styleUrl: './cabine.component.scss'
})
export class CabineComponent implements OnInit {

  listCabin: Cabin[] = [];
  listType: Garment[] = [];
  cabin!: Cabin;

  readonly cats: Cat[] = ['chapeau', 'haut', 'bas', 'chaussures'];
  readonly gender = signal<'MAN' | 'WOMAN'>('MAN');
  readonly indexes = signal<Record<Cat, number>>({ chapeau: -1, haut: -1, bas: -1, chaussures: -1 });

  readonly mannequinImgHomme = 'pictures/mannequin-homme.webp';
  readonly mannequinImgFemme = 'pictures/mannequin-femme.webp';

  private cabinService = inject(CabineService);
  private productService = inject(ProductService);
  private typeService = inject(GarmentService);
  private carouselService = inject(CarouselService);

  product!:Product;
  isOpen = false;

  catalogue: Record<'MAN' | 'WOMAN', Record<string, Cabin[]>> = {
    MAN: {},
    WOMAN: {}
  };

  ngOnInit(): void {
    
    const cats: Cat[] = ['haut', 'bas', 'chapeau', 'chaussures'];

    forkJoin({
      cabins: this.cabinService.getAllCabin(),
      types: this.typeService.getAll()
    }).subscribe({
      next: ({ cabins, types }) => {
        this.listCabin = cabins;
        this.listType = types;

        // Construction du catalogue dynamique
        this.buildCatalogue();

        cats.forEach(cat => {
          const dbCat = mapCat[cat];
          const items = this.catalogue[this.gender()][dbCat];
          this.indexes()[cat] = items && items.length > 0 ? 0 : -1;
        });
      },
      error: (err) => console.error("Erreur API:", err)
    });
  }

  // Centre les images automatiquement s'applique avec ngStyle dans le template
  getStyle(cat: Cat): any {
    const item = this.getItem(cat);
    if (!item) return {};

    // Si X ou Y ne sont pas définis en base, on applique un centrage de secours à 0
    const leftPct = item.positionx !== undefined ? item.positionx : 0;
    const topPct = item.positiony !== undefined ? item.positiony : 0;

    return {
      position: 'absolute',
      left: `${leftPct}%`,
      top: `${topPct}%`,
      width: `${item.width}%`,
      height: `${item.height}%`,
      zIndex: item.zindex
    };
  }

  /**
   * Construit le catalogue à partir des garments
   */

  private buildCatalogue(): void {
    // Initialisation dynamique selon listType
    this.listType.forEach(t => {
      this.catalogue.MAN[t.name] = [];
      this.catalogue.WOMAN[t.name] = [];
    });

    // Remplissage avec les cabines
    this.listCabin.forEach(c => {
      const genreKey = c.genre as 'MAN' | 'WOMAN';
      const cat = c.type;

      if (this.catalogue[genreKey] && this.catalogue[genreKey][cat]) {
        this.catalogue[genreKey][cat].push(c); // 👈 on stocke directement l'objet Cabin
      }
    });
  }

  onGenderChange(event: Event): void {
    this.setGender((event.target as HTMLSelectElement).value);
  }

  setGender(g: string): void {
    this.gender.set(g as 'MAN' | 'WOMAN');
    this.indexes.set({ chapeau: -1, haut: -1, bas: -1, chaussures: -1 });
  }

  next(cat: Cat): void {
    const dbCat = mapCat[cat];
    const items = this.catalogue[this.gender()][dbCat];
    if (!items || items.length === 0) return;

    let i = this.indexes()[cat];
    i = (i + 1) % items.length;
    this.indexes()[cat] = i;

  }

  prev(cat: Cat): void {
    const dbCat = mapCat[cat];
    const items = this.catalogue[this.gender()][dbCat];
    if (!items || items.length === 0) return;

    let i = this.indexes()[cat];
    i = (i - 1 + items.length) % items.length;
    this.indexes()[cat] = i;
  }


  getItem(cat: Cat): Cabin | null {
    const dbCat = mapCat[cat]; // traduction
    const items = this.catalogue[this.gender()][dbCat];

    if (!items || items.length === 0) return null;

    const i = this.indexes()[cat];
    if (i < 0 || i >= items.length) return null;

    return items[i];
  }

  isHomme(): boolean {
    return this.gender() === 'MAN';
  }

  isFemme(): boolean {
    return this.gender() === 'WOMAN';
  }

  getImgSrc(cat: Cat): string | null {
    const item = this.getItem(cat);
    
    if (!item || !item.picturecabin || item.picturecabin === '/') return null;
    return `https://boycote.fr${item.picturecabin}`;
  }

  getNom(cat: Cat): string { return this.getItem(cat)?.title ?? '—'; }

  getUrl(cat: Cat): string { return this.getItem(cat)?.productlink ?? ''; }

  getId(cat: Cat): string | number{ return this.getItem(cat)?.id ?? ''; }

  getProduct(cat: Cat): string | number {
    const item = this.getItem(cat);
    if (!item) return "";

    this.productService.getProduct(item.idproduct).subscribe(res => {
      if (res.success) {
        this.product = res.product; // récupère le produit
      }
    });
    return this.product.id;
  }


  hasImg(cat: Cat): boolean {
    return !!this.getItem(cat)?.picturecabin;
  }

  hasItem(cat: Cat): boolean {
    return this.indexes()[cat] !== -1;
  }

closeCart() {
this.carouselService.setMode('standard');
}


}
