import { Component, inject, OnInit } from '@angular/core';
import { Product } from '../../../../models/product';
import { ApiService } from '../../../../services/api.service';
import { ComponentRightComponent } from "../../component-right/component-right.component";
import { ComponentLeftComponent } from "../../component-left/component-left.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carousel-select',
  imports: [CommonModule,ComponentRightComponent, ComponentLeftComponent],
  templateUrl: './carousel-select.component.html',
  styleUrl: './carousel-select.component.scss',
})
export class CarouselSelectComponent implements OnInit{


  ngOnInit(): void {

    this.loadProducts(); // RECUPERE LA LISTE DES PRODUITS
    this.updateVisibleCount(); // MAJ ARTICLES
    
    window.addEventListener('resize', () => {
      this.updateVisibleCount();
    });

    }

  private apiService = inject(ApiService); // SERVICE API

  articles: Product[] = []; // INITIALISATION DES ARTICLES
  visibleCount = 5; // nombre de card visible
  currentIndex = 0;
  isAnimating = false;
  direction: 'left' | 'right' = 'right';

  // CHARGE LA LISTE DES PRODUITS
  loadProducts() {
    this.apiService.getProducts().subscribe((p) => {
      this.articles = p;
    });
  }

  // MAJ DES ARTICLES
  updateVisibleArticles() {
    const half = Math.floor(this.visibleCount / 2);
    this.visibleArticles.toLocaleString([]);

    for (let i = -half; i <= half; i++) {
      const index = (this.currentIndex + i + this.articles.length) % this.articles.length;
      this.visibleArticles.push(this.articles[index]);
    }
  }

  // AFFICHE LES ARTICLES
  get visibleArticles() {
    const half = Math.floor(this.visibleCount / 2);
    const result = [];

    for (let i = -half; i <= half; i++) {
      const index = (this.currentIndex + i + this.articles.length) % this.articles.length;
      result.push(this.articles[index]);
    }

    return result;
  }

  // AFFICHE 5 ARTICLES POUR UN DESKTOP ET 3 POUR UN MOBILE EN FONCTION DE LA FENETRE
  updateVisibleCount() {
    if (window.innerWidth < 768) {
      this.visibleCount = 3;
    } else {
      this.visibleCount = 5;
    }

    this.updateVisibleArticles(); // MAJ DES ARTICLES
  }

  // ANIMATIONS
  triggerAnimation(dir: 'left' | 'right') {
    this.direction = dir;
    this.isAnimating = true;
    setTimeout(() => this.isAnimating = false, 180);
  }

  // BOUTON AVANCER
  next() {
    if (this.isAnimating) return;
    this.triggerAnimation('right');
    this.currentIndex = (this.currentIndex + 1) % this.articles.length;
  }

  // BOUTON RETOUR
  prev() {
    if (this.isAnimating) return;
    this.triggerAnimation('left');
    this.currentIndex =
      (this.currentIndex - 1 + this.articles.length) % this.articles.length;
  }

  // ROTATION DU CAROUSEL
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

  // LA CARTE RESTE AU DEVANT DES AUTRES
  getZIndex(i: number) {
    const middle = Math.floor(this.visibleCount / 2);
    return 100 - Math.abs(i - middle);
  }

  // CENTRE LA CARTE ACTIVE
  get centralArticle() {
    const middle = Math.floor(this.visibleCount / 2);
    return this.visibleArticles[middle];
  }

  // OPACITE DES CARDS
  getOpacity(i: number) {
    const middle = Math.floor(this.visibleCount / 2);
    const offset = Math.abs(i - middle);

    return 1 - offset * 0.15; // centre = 1, côtés = 0.85, 0.70, etc.
  }







}
