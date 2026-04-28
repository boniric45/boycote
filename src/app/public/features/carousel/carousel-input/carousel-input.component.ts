import { CommonModule } from '@angular/common';
import { Component, computed, inject, Input, OnInit, signal, Signal } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { ProgressbarComponent } from "../../../progressbar/progressbar.component";
import { ComponentLeftComponent } from '../../component-left/component-left.component';
import { ComponentRightComponent } from '../../component-right/component-right.component';

@Component({
  selector: 'app-carousel-input',
  imports: [CommonModule, ComponentRightComponent, ComponentLeftComponent, ProgressbarComponent],
  templateUrl: './carousel-input.component.html',
  styleUrl: './carousel-input.component.scss',
})
export class CarouselInputComponent implements OnInit{

  private apiService = inject(ApiService);

  articles = signal<any[]>([]);
  visibleCount = 5;
  currentIndex = 0;
  isAnimating = false;
  direction: 'left' | 'right' = 'right';

  @Input({required: true}) searchQuery!: Signal<string>;
  @Input() searchSubmitted!: Signal<boolean>;

  loadingPb: boolean = true;

  ngOnInit(): void {

    this.loadProducts();
    this.updateVisibleCount();

    window.addEventListener('resize', () => {
      this.updateVisibleCount();
    });
  }

  loadProducts() {
    this.apiService.getProducts().subscribe((p) => {
      this.articles.set(p);      
    });
  }

  // RECHERCHE DES PRODUITS
filtered = computed(() => {
  const term = this.searchQuery().trim().toLowerCase();

  // 🔥 Si aucune recherche → aucun résultat
  if (!term) return [];
  return this.articles().filter(p =>
    p.marque.toLowerCase().includes(term)
  );
});


// AFFICHE LE CAROUSEL SEULEMENT SI IL Y A TROIS IMAGES
canShowCarousel = computed(() => this.filtered().length >= 3);

normalized = computed(() => {
  const list = this.filtered();
  console.log('📌 normalized (before logic) =', list);

  // Aucun résultat → tableau vide
  if (list.length === 0) {
    return [];
  }

  // Moins de 5 résultats → duplication
  if (list.length < 5) {
    const result = [...list];
    while (result.length < 5) {
      result.push(...list);
    }
    return result.slice(0, 5);
  }

  // Sinon → liste normale
  return list;
});



get visibleArticles() {
  const articles = this.normalized();

  // Si aucun résultat → rien à afficher
  if (articles.length === 0) {
    return [];
  }

  const total = articles.length;
  const count = Math.min(this.visibleCount, total);

  const start = this.currentIndex - Math.floor(count / 2);

  const result = [];

  for (let i = 0; i < count; i++) {
    const index = (start + i + total) % total;
    result.push(articles[index]);
  }

  return result;
}


  trackByArticle(index: number, article: any) {
    return article?.id ?? index;
  }

  updateVisibleCount() {
    this.visibleCount = window.innerWidth < 768 ? 3 : 5;
  }

  triggerAnimation(dir: 'left' | 'right') {
    this.direction = dir;
    this.isAnimating = true;
    setTimeout(() => (this.isAnimating = false), 180);
  }


  next() {
    const total = this.normalized().length;
    if (total === 0) return;

    this.currentIndex = (this.currentIndex + 1) % total;
  }

  prev() {
    const total = this.normalized().length;
    if (total === 0) return;

    this.currentIndex = (this.currentIndex - 1 + total) % total;
  }

  getTransform(i: number) {
    const middle = Math.floor(this.visibleCount / 2);
    const offset = i - middle;

    const rotation = offset * 8;
    const scale = 1 - Math.abs(offset) * 0.06;
    const translateX = offset * 80;
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
    const middle = Math.floor(this.visibleCount / 2);
    return 100 - Math.abs(i - middle);
  }

  get centralArticle() {
    const middle = Math.floor(this.visibleCount / 2);
    return this.visibleArticles[middle];
  }

  getOpacity(i: number) {
    const middle = Math.floor(this.visibleCount / 2);
    const offset = Math.abs(i - middle);
    return 1 - offset * 0.15;
  }


}
