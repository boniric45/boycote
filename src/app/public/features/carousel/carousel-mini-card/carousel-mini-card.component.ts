import { Component, inject, Input } from '@angular/core';
import { Product } from '../../../../models/product';
import { ProductService } from '../../../../services/product.service';
import { Router, RouterLink } from '@angular/router';
import { LogicSelectService } from '../../../../services/logic-select.service';

@Component({
  selector: 'app-carousel-mini-card',
  imports: [],
  templateUrl: './carousel-mini-card.component.html',
  styleUrl: './carousel-mini-card.component.scss',
})
export class CarouselMiniCardComponent {

  @Input() article!: Product;
  private router = inject(Router);

  readViewProduct(idProduct: number) {
    console.log('Read View Mini Card  >>>>>>>>>>>>>>>>>>>>>>> ', idProduct);
    this.router.navigate(['product', idProduct]); // Navigue vers la page produit
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
