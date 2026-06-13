import { CommonModule } from '@angular/common';
import { Component, computed, inject, Input, OnChanges, OnInit, signal } from '@angular/core';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-product-card',
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent implements OnInit {

  productsSoldOut = signal<Product[]>([]); // La liste venant du service
  articles = signal<any[]>([]);

  private productService = inject(ProductService);

  product!:Product;

    titre = '';
    description = '';
    prix = 0;
    condition = '';
    genre = '';
    taille = '';
    mesures = '';
    afficherMesures = false;
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private cartService = inject(CartService);
    private apiService = inject(ApiService);
  
  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Get >Id >>>>>>>>> card ',id);

    // this.apiService.getProduct(id).subscribe(product => {
    //   this.product = product;
    //   console.log(this.product);
    // });

    this.apiService.getProduct(id).subscribe({
  next: (p) => console.log("NEXT :", p),
  error: (e) => console.log("ERROR :", e),
  complete: () => console.log("COMPLETE")
});

  }


  loadProductsSoldOut() {
    this.productService.disponibilityProductSoldOut().subscribe(psoldout => {
      this.productsSoldOut.set(psoldout);
    })
  }

  addToCart(product: Product) {
    this.cartService.add(product, 1);
  }

    addToRequest(id: number) {
    this.router.navigate(['/request/', id]);
  }

}
