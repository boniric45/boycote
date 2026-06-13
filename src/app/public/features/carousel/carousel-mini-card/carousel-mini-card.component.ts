import { Component, inject, Input } from '@angular/core';
import { Product } from '../../../../models/product';
import { ProductService } from '../../../../services/product.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-carousel-mini-card',
  imports: [],
  templateUrl: './carousel-mini-card.component.html',
  styleUrl: './carousel-mini-card.component.scss',
})
export class CarouselMiniCardComponent {

    @Input() article!: Product;
    private productService = inject(ProductService);
    private router = inject(Router);

    readViewProduct(idProduct: number) {
      console.log('ID >>>>>>>>>>>>>>>>>>>>>>> ',idProduct);
      
   // this.productService.getProduct(idProduct).subscribe();  // Injecte les infos dans ProductService    
    this.router.navigate(['product', idProduct]); // Navigue vers la page produit
  }

}
