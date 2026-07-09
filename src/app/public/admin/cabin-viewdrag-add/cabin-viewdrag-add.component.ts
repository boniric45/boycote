import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, inject, Input, Output, signal, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { forkJoin, Subscription } from 'rxjs';
import { Cabin } from '../../../models/cabin';
import { Garment } from '../../../models/garment';
import { CabineService } from '../../../services/cabine.service';
import { GarmentService } from '../../../services/garment.service';

type Cat = 'chapeau' | 'haut' | 'bas' | 'chaussures';

const mapCat: Record<string, string> = {
  haut: 'Tops',
  bas: 'Bottoms',
  chapeau: 'Headwear',
  chaussures: 'Footwear'
};

@Component({
  selector: 'app-cabin-viewdrag-add',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './cabin-viewdrag-add.component.html',
  styleUrl: './cabin-viewdrag-add.component.scss',
})

export class CabinViewdragAddComponent {

 @ViewChild('canvas') canvas!: ElementRef;
  
  @Input() picture?: string;
  @Input() x!: number;
  @Input() y!: number;
  @Input() w!: number;
  @Input() h!: number;
  @Input() z!: number;
  
ngOnChanges() {
  this.formCabin.patchValue({
    positionx: this.x,
    positiony: this.y,
    width: this.w,
    height: this.h,
    zindex: this.z,
    picturecabin: this.picture
  }, { emitEvent: false });

}

  formCabin = new FormGroup({
    id: new FormControl(0, { nonNullable: true }),
    sku: new FormControl('', { nonNullable: true }),
    idproduct: new FormControl(0, { nonNullable: true }),
    picturecabin: new FormControl('', { nonNullable: true }),
    title: new FormControl('', { nonNullable: true }),
    productlink: new FormControl('', { nonNullable: true }),
    positionx: new FormControl(0, { nonNullable: true }),
    positiony: new FormControl(0, { nonNullable: true }),
    zindex: new FormControl(0, { nonNullable: true }),
    width: new FormControl(0, { nonNullable: true }),
    height: new FormControl(0, { nonNullable: true }),
    type: new FormControl('', { nonNullable: true }),
    genre: new FormControl('', { nonNullable: true }),
    displayorder: new FormControl(0, { nonNullable: true })
  });

  listCabin: Cabin[] = [];
  listType: Garment[] = [];
  cabin!: Cabin;

  readonly cats: Cat[] = ['chapeau', 'haut', 'bas', 'chaussures'];
  readonly gender = signal<'MAN' | 'WOMAN'>('MAN');
  readonly indexes = signal<Record<Cat, number>>({ chapeau: -1, haut: -1, bas: -1, chaussures: -1 });

  readonly mannequinImgHomme = 'pictures/mannequin-homme.webp';
  readonly mannequinImgFemme = 'pictures/mannequin-femme.webp';

  private currentAction: 'move' | 'resize' | null = null;
  private startX: number = 0;
  private startY: number = 0;
  private startWPercent: number = 0;
  private startHPercent: number = 0;
  private startXPercent: number = 0;
  private startYPercent: number = 0;

  private cabinService = inject(CabineService);
  private typeService = inject(GarmentService);
  private _subscription = Subscription.EMPTY;

  // Ton catalogue typé avec MAN/WOMAN
  catalogue: Record<'MAN' | 'WOMAN', Record<string, Cabin[]>> = {
    MAN: {},
    WOMAN: {}
  };

  ngOnInit(): void {
    const cats: Cat[] = ['haut', 'bas', 'chapeau', 'chaussures'];

   this._subscription = forkJoin({
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

  const url = item.picturecabin;

  // Si l’URL est déjà complète → on ne touche à rien
  if (url.startsWith('http')) {
    return url;
  }
 
  // Sinon → on ajoute le domaine
  return `https://boycote.fr${url}`;
}


  getNom(cat: Cat): string { return this.getItem(cat)?.title ?? '—'; }
  getUrl(cat: Cat): string { return this.getItem(cat)?.productlink ?? ''; }


  hasImg(cat: Cat): boolean {
    return !!this.getItem(cat)?.picturecabin;
  }

  hasItem(cat: Cat): boolean {
    return this.indexes()[cat] !== -1;
  }

  startDrag(event: MouseEvent, action: 'move' | 'resize') {

  if (!this.picture ) {
    console.warn("Drag bloqué : données pas encore chargées");
    return;
  }
    event.preventDefault();
    event.stopPropagation();

    this.currentAction = action;
    this.startX = event.clientX;
    this.startY = event.clientY;

    this.startXPercent = this.formCabin.controls.positionx.value;
    this.startYPercent = this.formCabin.controls.positiony.value;
    this.startWPercent = this.formCabin.controls.width.value;
    this.startHPercent = this.formCabin.controls.height.value;
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const canvasEl = this.canvas.nativeElement;
    const canvasWidth = canvasEl.clientWidth;
    const canvasHeight = canvasEl.clientHeight;

    if (!canvasEl) return;
    if (!this.currentAction || !this.canvas) return;

    this.cabinService.x.set(this.formCabin.controls.positionx.value);
    this.cabinService.y.set(this.formCabin.controls.positiony.value);
    this.cabinService.w.set(this.formCabin.controls.width.value);
    this.cabinService.h.set(this.formCabin.controls.height.value);
    this.cabinService.z.set(this.formCabin.controls.zindex.value);
    this.cabinService.picture.set(this.formCabin.controls.picturecabin.value);



    // Transformation du delta pixel en ratio pourcentage (%)
    const deltaXPercent = ((event.clientX - this.startX) / canvasWidth) * 100;
    const deltaYPercent = ((event.clientY - this.startY) / canvasHeight) * 100;

    if (this.currentAction === 'move') {
      this.formCabin.patchValue({
        positionx: Math.round(this.startXPercent + deltaXPercent),
        positiony: Math.round(this.startYPercent + deltaYPercent)
      });
    } else if (this.currentAction === 'resize') {
      this.formCabin.patchValue({
        width: Math.max(5, Math.round(this.startWPercent + deltaXPercent)),
        height: Math.max(5, Math.round(this.startHPercent + deltaYPercent))
      });
    }

    this.validateBounds();
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    this.currentAction = null;
  }
  
    validateBounds() {
    let x = this.formCabin.controls.positionx.value;
    let y = this.formCabin.controls.positiony.value;
    let w = this.formCabin.controls.width.value;
    let h = this.formCabin.controls.height.value;

    if (x < 0) x = 0;
    if (y < 0) y = 0;
    if (x > 100 - w) x = 100 - w; // Empêche de sortir par la droite
    if (y > 100 - h) y = 100 - h; // Empêche de sortir par le bas
    
    if (w < 5) w = 5;
    if (h < 5) h = 5;
    if (w > 100) w = 100;
    if (h > 100) h = 100;

    this.formCabin.patchValue({ positionx: x, positiony: y, width: w, height: h }, { emitEvent: false });
  }


  ngOnDestroy(){
    this._subscription.unsubscribe();
  }
}


