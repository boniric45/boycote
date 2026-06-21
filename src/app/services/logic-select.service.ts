import { computed, Injectable, signal } from '@angular/core';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class LogicSelectService {

  articles = signal<Product[]>([]);
  private soldOut = signal<Product[]>([]);
  private filters = signal<any | null>(null);
  private search = signal<string>('');

  visibleCount = signal(5);
  currentIndex = signal(0);
  isAnimating = signal(false);
  direction = signal<'left' | 'right'>('right');

  setArticles(list: Product[]) { this.articles.set(list); }
  setSoldOut(list: Product[]) { this.soldOut.set(list); }
  setFilters(f: any) {
    this.filters.set(f); console.log('logic > ', this.filters());
  }
  setSearch(term: string) {
    this.search.set(term.toLowerCase());
  }


  filtered = computed(() => {
    const f = this.filters();
    console.log('f',f);
    
    let list = this.articles();
    console.log('LIST >> ',list);
    

    if (!f) return list;

    if (f.marques?.length) {
      list = list.filter(p => f.marques.includes(p.marque));
    }

    if (f.types?.length) {
      list = list.filter(p => f.types.includes(p.type));
    }

    if (f.genders?.length) {
      list = list.filter(p => f.genders.includes(p.gender));
    }


    list.forEach(l => {
      console.log(l.marque);
      
    })
    
    return list;
  });


  noResult = computed(() => this.filtered().length === 0);
  fallbackMode = computed(() => this.filtered().length > 0 && this.filtered().length < 3);
  canShowCarousel = computed(() => this.filtered().length >= 3);

  merged = computed(() => {
    const sold = new Set(this.soldOut().map(p => p.id));
    return this.filtered().map(p => ({
      ...p,
      isSoldOut: sold.has(p.id)
    }));
  });

  normalized = computed(() => {
    const list = this.merged();
    if (list.length === 0) return [];
    if (list.length < 5) {
      const result = [...list];
      while (result.length < 5) result.push(...list);
      return result.slice(0, 5);
    }
    return list;
  });

  visible = computed(() => {
    const list = this.normalized();
    const total = list.length;
    const count = this.visibleCount();
    const start = this.currentIndex() - Math.floor(count / 2);

    const result: any[] = [];
    for (let i = 0; i < count; i++) {
      const index = (start + i + total) % total;
      result.push(list[index]);
    }
    return result;
  });

  central = computed(() => {
    const list = this.visible();
    if (!list.length) return null;
    const middle = Math.floor(this.visibleCount() / 2);
    return list[middle];
  });

  next() {
    const total = this.normalized().length;
    if (total === 0) return;
    this.direction.set('right');
    this.triggerAnimation();
    this.currentIndex.set((this.currentIndex() + 1) % total);
  }

  prev() {
    const total = this.normalized().length;
    if (total === 0) return;
    this.direction.set('left');
    this.triggerAnimation();
    this.currentIndex.set((this.currentIndex() - 1 + total) % total);
  }

  private triggerAnimation() {
    this.isAnimating.set(true);
    setTimeout(() => this.isAnimating.set(false), 180);
  }

  getTransform(i: number) {
    const middle = Math.floor(this.visibleCount() / 2);
    const offset = i - middle;
    const isMobile = window.innerWidth < 900;
    const rotation = offset * 8;
    const scale = 1 - Math.abs(offset) * 0.06;
    const translateX = offset * (isMobile ? 40 : 80);
    const translateZ = 80 - Math.abs(offset) * 30;

    return `
      perspective(1000px)
      translateX(${translateX}px)
      translateZ(${translateZ}px)
      rotateY(${rotation}deg)
      scale(${scale})
    `;
  }


  getZIndex(i: number) {
    const middle = Math.floor(this.visibleCount() / 2);
    return 100 - Math.abs(i - middle);
  }

  getOpacity(i: number) {
    const middle = Math.floor(this.visibleCount() / 2);
    return 1 - Math.abs(i - middle) * 0.15;
  }

}
