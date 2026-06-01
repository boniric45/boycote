import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../../../models/product';
import { ProductService } from '../../../../services/product.service';
import { CartComponent } from "../../../cart/cart.component";
import { FooterComponent } from "../../../footer/footer.component";
import { ProductCardComponent } from '../../../product-card/product-card.component';
import { ButtonReturnComponent } from "../../button-return/button-return.component";
import { ComponentLeftComponent } from '../../component-left/component-left.component';
import { ComponentRightComponent } from '../../component-right/component-right.component';
import { CartService } from '../../../../services/cart.service';

@Component({
  selector: 'app-carousel-product',
  imports: [CommonModule, ComponentRightComponent, ComponentLeftComponent, FooterComponent, ProductCardComponent, CartComponent, ButtonReturnComponent],
  templateUrl: './carousel-product.component.html',
  styleUrl: './carousel-product.component.scss',
})
export class CarouselProductComponent implements OnInit{

 private productService = inject(ProductService);
 private router = inject(Router);
 private route = inject(ActivatedRoute);
 private cartService = inject(CartService);

  articles = signal<any[]>([]);
  visibleCount = 3;
  currentIndex = 0;
  isAnimating = false;
  direction: 'left' | 'right' = 'right';
  product!:Product;
  private touchStartX = 0;
  private touchEndX = 0;
  isFullscreen = false;

ngOnInit(): void {

  // 1. On tente de lire le produit depuis le service
  this.product = this.productService.product;


  // 2. Si le produit existe déjà (cas normal sans refresh)
  if (this.product) {
    let imageList = this.productService.buildImageObjects(this.product);
    this.articles.set(imageList.slice(1)); // On enlève la première image    
    return;
  }

  this.productService.deleteFirstPicture(this.articles());

  // 3. Sinon, on recharge via l’ID dans l’URL (cas refresh)
  this.route.params.subscribe(params => {
    const id = params['id'];

    this.productService.getProduct(id).subscribe(res => {
      if (res.success) {
        this.product = res.product;

        let imageList = this.productService.buildImageObjects(this.product);

        // 🔥 Supprimer la première image directement
        this.articles.set(imageList.slice(1));
      }
    });
  });

  // 4. On calcule visibleCount AVANT de calculer le centre
   this.visibleCount = this.articles().length;

  // 5. On place le centre au milieu
  this.currentIndex = Math.floor(this.visibleCount / 2);
    // this.currentIndex = Math.floor(this.visibleCount / 2);

  // 6. On met à jour visibleCount SI NÉCESSAIRE (mobile, responsive…)
  this.updateVisibleCount();

  // 7. Et on recalcule le centre APRÈS updateVisibleCount
  this.currentIndex = Math.floor(this.visibleCount / 2);

  window.addEventListener('resize', () => {
    this.updateVisibleCount();
    this.currentIndex = Math.floor(this.visibleCount / 2); // 🔥 indispensable
  });
}

  // Zoom la photo 
  fullscreenImage: string | null = null;

  openFullscreen(src: string) {
    this.fullscreenImage = src;
    document.body.style.overflow = 'hidden';
  }

  closeFullscreen() {
    this.fullscreenImage = null;
  }
 
  get visibleArticles() {
    // SI ARTICLES EST VIDE RENVOI []
    if (!this.articles() || this.articles().length === 0) {
      return [];
    }
  
    const total = this.articles().length;
    const result = [];
    const count = Math.min(this.visibleCount, total);
    const start = this.currentIndex - Math.floor(count / 2);

    for (let i = 0; i < count; i++) {
      const index = (start + i + total) % total;
      result.push(this.articles()[index]);
    }

    return result;
  }

  trackByArticle(index: number, article: Product) {
    const finalImages = [];
    if (this.articles().length < 10) {
    for (const img in article) {
      finalImages.push(img);
    }
  }

    return article.id ?? index;
  }


  updateVisibleCount() {
    this.visibleCount = window.innerWidth < 768 ? 5 : 5;
  }

  triggerAnimation(dir: 'left' | 'right') {
    this.direction = dir;
    this.isAnimating = true;
    setTimeout(() => (this.isAnimating = false), 180);
  }

  next() {
   if (this.isAnimating) return;
    this.triggerAnimation('right');
    this.currentIndex = (this.currentIndex + 1) % this.articles().length;
  }

  prev() {
    if (this.isAnimating) return;
    this.triggerAnimation('left');
    this.currentIndex = (this.currentIndex - 1 + this.articles().length) % this.articles().length;
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
      return this.visibleArticles[middle] ;
  }

  getOpacity(i: number) { 
    const middle = Math.floor(this.visibleCount / 2);
    const offset = Math.abs(i - middle);
    return 1 - offset * 0.15;
  }

  readViewProduct(product:Product){    
    this.productService.product = product; // Injecte les infos dans ProductService
     this.router.navigateByUrl('viewpProduct'); // Navigue vers la page produit
     
  }

  // HAND SWIPE MOBILE //
onTouchStart(event: TouchEvent) {
  this.touchStartX = event.changedTouches[0].clientX;
}

onTouchEnd(event: TouchEvent) {
  this.touchEndX = event.changedTouches[0].clientX;
  this.handleSwipe();
}

handleSwipe() {
  const delta = this.touchEndX - this.touchStartX;

  if (Math.abs(delta) < 40) return; // seuil minimal

  if (delta < 0) {
    this.next();
  } else {
    this.prev();
  }
}

  // ADD TO CART 
  addToCart(product: Product) {
  this.cartService.add(product, 1);
  }

}
