import { computed, effect, Injectable, signal } from '@angular/core';
import { Product } from '../models/product';
import { ApiService } from './api.service';
import { CarouselService } from './carousel.service';
import { ProductService } from './product.service';

function normalize(str: string) {
  return str?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

@Injectable({
  providedIn: 'root',
})
export class LogicInputService {

  constructor(
    private apiService: ApiService,
    private productService: ProductService,
    private carouselService: CarouselService
  ) {
    this.apiService.getProducts().subscribe(p => this.articles.set(p));
    this.productService.disponibilityProductSoldOut().subscribe(s => this.soldOut.set(s));


    effect(() => {
      const result = this.filtered();
      if (this.carouselService.carouselMode() === 'search' || this.carouselService.carouselMode() === 'loading') {
        if (result.length === 0) {
          this.carouselService.setMode('noresult');
        }
      }
    });
  }

  product!: Product;
  articles = signal<Product[]>([]);
  private soldOut = signal<Product[]>([]);
  private filters = signal<string>('');

  visibleCount = signal(3);
  currentIndex = signal(0);
  isAnimating = signal(false);
  direction = signal<'left' | 'right'>('right');

  setFilters(f: any) {
    this.filters.set(f.toLowerCase());
  }

  noResult = computed(() => this.filtered().length === 0);
  fallbackMode = computed(() => this.filtered().length > 0 && this.filtered().length < 3);
  canShowCarousel = computed(() => this.filtered().length >= 3);


  filtered = computed(() => {
    const f = (this.filters() ?? '').toLowerCase();
    let list: Product[] = this.articles(); // All Products
    const result = list.filter(p => {
      return p.marque.toLowerCase().includes(f);
    });
    return result;
  });


  merged = computed(() => {
    const sold = new Set(this.soldOut().map(p => p.id));
    return this.filtered().map(p => ({
      ...p,
      isSoldOut: sold.has(p.id)
    }));
  });

  normalized = computed(() => this.merged());

  autoVisibleCount = computed(() => {
    const len = this.filtered().length;
    if (len >= 3) return 3;   // Carousel normal
    return len;               // 1 ou 2 items
  });

  visible = computed(() => {
    const list = this.normalized();
    const total = list.length;
    const count = this.autoVisibleCount();
    const start = this.currentIndex() - Math.floor(count / 2);
    const soldOutIds = new Set(this.soldOut().map(p => p.id));
    const result: any[] = [];
    if (count) {
      for (let i = 0; i < count; i++) {
        const index = (start + i + total) % total;
        const article = list[index];
        const fixedUrl = this.fixLocalUrl(article.pathpictureone);
        result.push({
          ...article,
          pathpictureone: fixedUrl,
          isSoldOut: soldOutIds.has(article.id)
        });
      }
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
  if (this.filtered().length < 3) return;
  const total = this.normalized().length;
  if (total === 0) return;
  this.direction.set('right');
  this.triggerAnimation();
  this.currentIndex.set((this.currentIndex() + 1) % total);
  }

prev() {
  if (this.filtered().length < 3) return;
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
    const middle = Math.floor(this.autoVisibleCount() / 2);
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
    const middle = Math.floor(this.autoVisibleCount() / 2);
    return 100 - Math.abs(i - middle);
  }

  getOpacity(i: number) {
    const middle = Math.floor(this.autoVisibleCount() / 2);
    return 1 - Math.abs(i - middle) * 0.15;
  }

  // Affiche les photos seulement pour le Dev
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

}
