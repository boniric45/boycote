import {
  Component, Input, OnChanges,
  AfterViewInit, ViewChildren,
  QueryList, ElementRef, output
} from '@angular/core';

export interface Produit {
  id: number;
  nom: string;
  image: string;
  prix: number;
  soldOut: boolean;
}

const SLOTS: Record<number, { x: number; sc: number; op: number; zi: number }> = {
  [-3]: { x: -170, sc: 0.50, op: 0.00, zi: 1 },
  [-2]: { x: -100, sc: 0.72, op: 0.28, zi: 2 },
  [-1]: { x:  -58, sc: 0.86, op: 0.88, zi: 4 },
  [ 0]: { x:    0, sc: 1.00, op: 1.00, zi: 6 },
  [ 1]: { x:   58, sc: 0.86, op: 0.88, zi: 4 },
  [ 2]: { x:  100, sc: 0.72, op: 0.28, zi: 2 },
  [ 3]: { x:  170, sc: 0.50, op: 0.00, zi: 1 },
};

const ANIM = 'transform 0.48s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.48s ease';

@Component({
  selector: 'app-test2',
  imports: [],
  templateUrl: './test2.component.html',
  styleUrl: './test2.component.scss',
})
export class Test2Component implements OnChanges,AfterViewInit{

  @Input() produits: Produit[] = [];

  addToCart    = output<Produit>();
  openProduct  = output<Produit>();
  openSourcing = output<Produit>();

  @ViewChildren('card') cardRefs!: QueryList<ElementRef<HTMLElement>>;

  curIndex  = 0;
  cardSlots = [-3, -2, -1, 0, 1, 2, 3];
  busy      = false;

  get current(): Produit {
    return this.produits[this.curIndex] ?? {
      id: 0, nom: '', image: '', prix: 0, soldOut: false
    };
  }

  // setTimeout(0) garantit que les 7 cartes DOM sont rendues avant drawAll
  ngAfterViewInit(): void {
    setTimeout(() => this.drawAll(false), 0);
  }

  ngOnChanges(): void {
    this.curIndex  = 0;
    this.cardSlots = [-3, -2, -1, 0, 1, 2, 3];
    setTimeout(() => this.drawAll(false), 0);
  }

  go(dir: 1 | -1): void {
    if (this.busy || !this.produits.length) return;
    this.busy = true;

    const cards = this.cardRefs.toArray();
    const n     = this.produits.length;

    // 1. Téléporte la carte sortante au slot tampon opposé SANS animation
    for (let i = 0; i < 7; i++) {
      const next = this.cardSlots[i] - dir;
      if (next < -3 || next > 3) {
        this.cardSlots[i] = next < -3 ? 3 : -3;
        this.applySlot(cards[i].nativeElement, i, false);
      }
    }

    // 2. Force le reflow — garantit que la téléportation est rendue avant l'animation
    cards[0].nativeElement.getBoundingClientRect();

    // 3. Avance le curseur et déplace tous les slots
    this.curIndex = ((this.curIndex + dir) % n + n) % n;
    for (let i = 0; i < 7; i++) {
      this.cardSlots[i] -= dir;
      if (this.cardSlots[i] < -3) this.cardSlots[i] = 3;
      if (this.cardSlots[i] >  3) this.cardSlots[i] = -3;
    }

    // 4. Anime toutes les cartes
    this.drawAll(true);
    setTimeout(() => { this.busy = false; }, 520);
  }

  private applySlot(el: HTMLElement, i: number, animate: boolean): void {
    const slot = this.cardSlots[i];
    const s    = SLOTS[slot];
    const n    = this.produits.length;

    el.style.transition    = animate && Math.abs(slot) < 3 ? ANIM : 'none';
    el.style.transform     = `translateX(${s.x}px) scale(${s.sc})`;
    el.style.opacity       = String(s.op);
    el.style.zIndex        = String(s.zi);
    el.style.boxShadow     = slot === 0 ? '0 8px 24px rgba(0,0,0,0.36)' : '0 3px 10px rgba(0,0,0,0.14)';
    el.style.pointerEvents = slot === 0 ? 'auto' : 'none';

    if (!n) return;
    const p = this.produits[((this.curIndex + slot) % n + n) % n];

    const img  = el.querySelector('img')           as HTMLImageElement;
    const sold = el.querySelector('.sold-overlay') as HTMLElement;
    const num  = el.querySelector('.card-num')     as HTMLElement;

    if (img)  { img.src = p.image; img.alt = p.nom; }
    if (sold) sold.style.display = p.soldOut ? 'block' : 'none';
    if (num)  num.textContent    = String(p.id);
  }

  private drawAll(animate: boolean): void {
    if (!this.cardRefs) return;
    const cards = this.cardRefs.toArray();
    if (cards.length !== 7) return;
    for (let i = 0; i < 7; i++) {
      this.applySlot(cards[i].nativeElement, i, animate);
    }
  }

  onCardClick(i: number): void {
    if (this.cardSlots[i] === 0) this.openProduct.emit(this.current);
  }




}
