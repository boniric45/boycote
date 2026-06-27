import { computed, inject, Injectable, signal } from '@angular/core';
import { Product } from '../models/product';
import { ProductService } from './product.service';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class LogicSelectService {

  constructor(
    private apiService: ApiService,
    private productService: ProductService
  ) {
    this.apiService.getProducts().subscribe(p => this.articles.set(p));
    this.productService.disponibilityProductSoldOut().subscribe(s => this.soldOut.set(s));
  }

  articles = signal<Product[]>([]);
  private soldOut = signal<Product[]>([]);
  private filters = signal<any | null>(null);

  visibleCount = signal(5);
  currentIndex = signal(0);
  isAnimating = signal(false);
  direction = signal<'left' | 'right'>('right');

  setFilters(f: any) {
    this.filters.set(f);
  }

  filtered = computed(() => {
    const f = this.filters();   // Valeur du champ de recherche
    let list = this.articles();   // All Products mettre en place des toasts

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

  fixLocalUrl(url: string): string {
    if (!url) return '';

    // 1. Si l’URL commence par localhost → remplacer
    if (url.startsWith('http://localhost:4200')) {
      return url.replace('http://localhost:4200', 'https://boycote.fr');
    }

    // 2. Si l’URL est relative → préfixer ton domaine
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://boycote.fr/${url.replace(/^\//, '')}`;
    }

    // 3. Sinon on renvoie tel quel
    return url;
  }

  visible = computed(() => {
    const list = this.normalized();
    const total = list.length;
    const count = this.visibleCount();
    const start = this.currentIndex() - Math.floor(count / 2);
    const soldOutIds = new Set(this.soldOut().map(p => p.id));
    const result: any[] = [];

    for (let i = 0; i < count; i++) {
      const index = (start + i + total) % total;
      const article = list[index];
      const fixedUrl = this.fixLocalUrl(article.pathpictureone);
      result.push({
        ...article,
        pathpictureone: fixedUrl,
        isSoldOut: soldOutIds.has(article.id)
      })
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
