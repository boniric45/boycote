import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Product } from '../../models/product';
import { CommonModule } from '@angular/common';
import { ComponentRightComponent } from "../features/component-right/component-right.component";
import { ComponentLeftComponent } from "../features/component-left/component-left.component";

@Component({
  selector: 'app-carousel-test',
  templateUrl: './carousel-test.component.html',
  imports: [CommonModule, ComponentRightComponent, ComponentLeftComponent],
  styleUrls: ['./carousel-test.component.scss']
})
export class CarouselTestComponent  implements OnInit{

  private apiService = inject(ApiService);

  articles: Product[] = [];
  visibleCount = 5;
  currentIndex = 0;
  isAnimating = false;
  direction: 'left' | 'right' = 'right';

  ngOnInit(): void {
    this.loadProducts();
    this.updateVisibleCount();

    window.addEventListener('resize', () => {
      this.updateVisibleCount();
    });
    
  }

  loadProducts() {
    this.apiService.getProducts().subscribe((p) => {
      this.articles = p;      
    });
  }

  // VERSION FINALE : aucune duplication, aucun undefined
get visibleArticles() {
  if (!this.articles || this.articles.length === 0) {
    return [];
  }

  const total = this.articles.length;
  const count = Math.min(this.visibleCount, total);

  const start = this.currentIndex - Math.floor(count / 2);

  const result = [];

  for (let i = 0; i < count; i++) {
    const index = (start + i + total) % total;
    result.push(this.articles[index]);
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
    if (this.isAnimating) return;
    this.triggerAnimation('right');
    this.currentIndex = (this.currentIndex + 1) % this.articles.length;
  }

  prev() {
    if (this.isAnimating) return;
    this.triggerAnimation('left');
    this.currentIndex =
      (this.currentIndex - 1 + this.articles.length) % this.articles.length;
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
