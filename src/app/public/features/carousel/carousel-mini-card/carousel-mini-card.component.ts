import { Component, inject, Input } from '@angular/core';
import { Product } from '../../../../models/product';
import { CarouselService } from '../../../../services/carousel.service';
import { LogicProductService } from '../../../../services/logic-product.service';

@Component({
  selector: 'app-carousel-mini-card',
  imports: [],
  templateUrl: './carousel-mini-card.component.html',
  styleUrl: './carousel-mini-card.component.scss',
})
export class CarouselMiniCardComponent {

  @Input() article!: Product;
  private carouselService = inject(CarouselService);
    private logicProduct = inject(LogicProductService);
  

  readViewProduct(product: Product) {
    this.carouselService.setMode('product')
    this.logicProduct.product = product;
  }

  fixLocalUrl(url: string): string {
    if (!url) return '';

    if (url.startsWith('http://localhost:4200')) {
      return url.replace('http://localhost:4200', 'https://boycote.fr');
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://boycote.fr/${url.replace(/^\//, '')}`;
    }

    return url;
  }


}
