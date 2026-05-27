

import { Component, inject, OnInit, signal } from "@angular/core";
import { RouterModule } from "@angular/router";
import { forkJoin } from 'rxjs';
import { Cabin } from "../../models/cabin";
import { Garment } from "../../models/garment";
import { CabineService } from "../../services/cabine.service";
import { GarmentService } from "../../services/garment.service";
import { ButtonReturnComponent } from "../features/button-return/button-return.component";
import { BrowserModule } from "@angular/platform-browser";

type Cat = 'chapeau' | 'haut' | 'bas' | 'chaussures';

const mapCat: Record<string, string> = {
  haut: 'Tops',
  bas: 'Bottoms',
  chapeau: 'Headwear',
  chaussures: 'Footwear'
};

@Component({
  selector: 'app-cabine',
  standalone:true,
  imports: [RouterModule, ButtonReturnComponent, BrowserModule],
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

  readonly mannequinImgHomme = 'assets/mannequin-homme.png';
  readonly mannequinImgFemme = 'assets/mannequin-femme.png';

  private cabinService = inject(CabineService);
  private typeService = inject(GarmentService);

  // Ton catalogue typé avec MAN/WOMAN
  catalogue: Record<'MAN' | 'WOMAN', Record<string, Cabin[]>> = {
    MAN: {},
    WOMAN: {}
  };

  ngOnInit(): void {
    forkJoin({
      cabins: this.cabinService.getAllCabin(),
      types: this.typeService.getAll()
    }).subscribe({
      next: ({ cabins, types }) => {
        this.listCabin = cabins;
        this.listType = types;

        // Construction du catalogue dynamique
        this.buildCatalogue();
      },
      error: (err) => console.error("Erreur API:", err)
    });
  
    const cats: Cat[] = ['haut', 'bas', 'chapeau', 'chaussures'];
    cats.forEach(cat => {
      const dbCat = mapCat[cat];
      const items = this.catalogue[this.gender()][dbCat];
      this.indexes()[cat] = items && items.length > 0 ? 0 : -1;
    });
 
  }

  private fallback = {
    chapeau: { x: 120, y: 20, w: 180, h: 180 },
    haut: { x: 100, y: 180, w: 280, h: 320 },
    bas: { x: 100, y: 480, w: 280, h: 320 },
    chaussures: { x: 120, y: 780, w: 220, h: 120 }
  };

  // Centre les images automatiquement s'applique avec ngStyle dans le template
getStyle(cat: Cat): any {
  const item = this.getItem(cat);
  if (!item) return {};

  const mannequinWidth = 981;
  const mannequinHeight = 1151;

  // Conversion en %
  const widthPct = (item.width / mannequinWidth) * 100;
  const heightPct = (item.height / mannequinHeight) * 100;
  let leftPct = (item.positionx / mannequinWidth) * 100;
  let topPct = (item.positiony / mannequinHeight) * 100;

  // Centrage si X/Y non définis
  if (item.positionx === undefined || item.positiony === undefined) {
    leftPct = (100 - widthPct) / 2;
    topPct = (100 - heightPct) / 2;
  }

  // Offsets par catégorie
  switch (cat) {
    case 'chapeau':
      topPct -= 10; // décalé vers le haut
      break;
    case 'bas':
      topPct += 5; // légèrement plus bas
      break;
    case 'chaussures':
      topPct += 15; // vers le bas
      break;
    // haut reste centré
  }

  return {
    position: 'absolute',
    left: `${leftPct}%`,
    top: `${topPct}%`,
    width: `${widthPct}%`,
    height: `${heightPct}%`,
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



  getImgTop(cat: Cat): string { 
    const y = this.getItem(cat)?.positiony;
    return (y && y > 50 ? y : this.fallback[cat].y) + 'px';
  }

  getImgLeft(cat: Cat): string {
    const x = this.getItem(cat)?.positionx;
    return (x && x > 50 ? x : this.fallback[cat].x) + 'px';
  }

  getImgWidth(cat: Cat): string {
    const w = this.getItem(cat)?.width;
    return (w && w > 50 ? w : this.fallback[cat].w) + 'px';
  }

  getImgHeight(cat: Cat): string {
    const h = this.getItem(cat)?.height;
    return (h && h > 50 ? h : this.fallback[cat].h) + 'px';
  }

  getZIndex(cat: Cat): number { return this.getItem(cat)?.zindex ?? 1; }
  getNom(cat: Cat): string { return this.getItem(cat)?.title ?? '—'; }
  getUrl(cat: Cat): string { return this.getItem(cat)?.productlink ?? ''; }


  hasImg(cat: Cat): boolean {
    return !!this.getItem(cat)?.picturecabin;
  }

  hasItem(cat: Cat): boolean {
    return this.indexes()[cat] !== -1;
  }



}
