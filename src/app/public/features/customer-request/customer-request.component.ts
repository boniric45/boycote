import { CommonModule, Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, Input, OnInit, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product } from '../../../models/product';
import { EmailService } from '../../../services/email.service';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-customer-request',
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-request.component.html',
  styleUrl: './customer-request.component.scss',
})


export class CustomerRequestComponent implements OnInit{

  @Input() article!:Product;
  
  submitted = output<void>();
  product!:Product;

  idProduct:number = 0;
  private subscription  = new Subscription();
  email = '';
  isOpen = signal(true);
  productsSoldOut:Product[] = [];
  

  private apiUrl = 'https://www.boycote.fr/api';

  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private emailService = inject(EmailService);
  private http = inject(HttpClient);
  private location = inject(Location);

  ngOnInit(){
      // const id = this.route.snapshot.paramMap.get('id');

      // if(id) {
      //   this.idProduct =+ id;
      //   this.loadProductsSoldOut();
      // }
    
      console.log(this.article);
      

  }

  ngOnChanges(){
    console.log('Change > ',this.product);
  }

  // ALIMENTE LA LISTE DES SOLDOUT
  loadProductsSoldOut() {
    this.productService.disponibilityProductSoldOut().subscribe({
      next:(result)=> {
        this.productsSoldOut = result;
        this.productsSoldOut.forEach(p => {
          if(p.id === this.idProduct ){
            this.product = p;
          }
        })
      },
      error:(err)=>{
        console.log(err);
      }
    });

  }

 OnDestroy(){
  this.subscription.unsubscribe();
 }

  submit(): void {
    if (!this.email) return;

    const contactData = {
          email: this.email,
          nom:   this.product.name,
          sku:   this.product.sku,
          marque: this.product.marque,
          size: this.product.size
        };

        console.log('Données envoyées au PHP :', contactData);
    this.emailService.sendEmail(contactData).subscribe({
      next:(response)=>{
        if(response){
          alert('message sent successfully');
          this.email='';
        }
      },
      error:()=>{
        alert('message not sent, sorry');
      }
    })

  }


return() {
      this.location.back();  
}

onOverlayClick($event: PointerEvent) {
  console.log($event);
}



}
