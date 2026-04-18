import { Component, inject, Input, OnInit, Signal, signal } from '@angular/core';
import { ComponentLeftComponent } from "../../component-left/component-left.component";
import { ComponentRightComponent } from "../../component-right/component-right.component";
import { ApiService } from '../../../../services/api.service';
import { Product } from '../../../../models/product';
import { CommonModule } from '@angular/common';
import { ProgressbarComponent } from '../../../progressbar/progressbar.component';

@Component({
  selector: 'app-carousel-list',
  imports: [ComponentLeftComponent, ComponentRightComponent, CommonModule,ProgressbarComponent],
  templateUrl: './carousel-list.component.html',
  styleUrl: './carousel-list.component.scss',
})
export class CarouselListComponent implements OnInit {

  articles: Product[] = [];
  visibleCount = 5;
  currentIndex = 0;
  isAnimating = false;
  direction: 'left' | 'right' = 'right';
  @Input() filteredArticlesSelected: Product[] = []; // Parent BoycoteComponent will set this
  @Input() loadingPb: boolean = false;


  ngOnInit(): void {
    this.updateVisibleCount();
    window.addEventListener('resize', () => {
      this.updateVisibleCount();
    });
  }


    get visibleArticles() {
      const articles = this.filteredArticlesSelected;

      if (!articles || articles.length === 0) return [];

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
    return this.filteredArticlesSelected[index]?.id ?? index;
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
    this.currentIndex =
      (this.currentIndex + 1) % this.filteredArticlesSelected.length;
  }

  prev() {
    if (this.isAnimating) return;
    this.triggerAnimation('left');
    this.currentIndex =
      (this.currentIndex - 1 + this.filteredArticlesSelected.length) %
      this.filteredArticlesSelected.length;
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


