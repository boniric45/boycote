import { CommonModule, Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product } from '../../../models/product';
import { ApiService } from '../../../services/api.service';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-customer-request',
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-request.component.html',
  styleUrl: './customer-request.component.scss',
})
export class CustomerRequestComponent implements OnInit{

  submitted = output<void>();
  /**
   * SIGNALS 
   */
  // product = signal<Product | any>('');
  product!:Product;
  idProduct:number = 0;
  private subscription  = new Subscription();
  email = signal('');
  isOpen = signal(true);
  productsSoldOut = signal<Product[]>([]);

  private apiUrl = 'https://www.boycote.fr/api';

  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private http = inject(HttpClient);
  private location = inject(Location);

  ngOnInit(){
      const id = this.route.snapshot.paramMap.get('id');

    this.loadProductsSoldOut();
    console.log(this.productsSoldOut());
    
  }

  ngOnChanges(){
    console.log(this.product);
  }


  // ALIMENTE LA LISTE DES SOLDOUT
  loadProductsSoldOut(){
    this.productService.disponibilityProductSoldOut().subscribe(psoldout => {
      this.productsSoldOut.set(psoldout);
    })
  }

 OnDestroy(){
  this.subscription.unsubscribe();
 }


  submit(): void {
    if (!this.email()) return;

    this.http.post(this.apiUrl, {
      nom:   this.product.name,
      sku:   this.product.sku,
      email: this.email
    }).subscribe({
      next: () => {
        this.isOpen.set(false);
        this.email.set('');
        this.submitted.emit();
      },
      error: (err) => console.error('Erreur sourcing:', err)
    });
  }


return() {
      this.location.back();  
}

onOverlayClick($event: PointerEvent) {
  console.log($event);
}



}
