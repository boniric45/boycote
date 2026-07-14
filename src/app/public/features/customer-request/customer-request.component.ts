import { CommonModule } from '@angular/common';
import { Component, inject, Input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Product } from '../../../models/product';
import { CarouselService } from '../../../services/carousel.service';
import { EmailService } from '../../../services/email.service';
import { LogicRequestService } from '../../../services/logic-request.service';
import { ProductService } from '../../../services/product.service';
import { CloseButtonComponent } from "../../../shared/close-button/close-button.component";

@Component({
  selector: 'app-customer-request',
  imports: [CommonModule, FormsModule, CloseButtonComponent],
  templateUrl: './customer-request.component.html',
  styleUrl: './customer-request.component.scss',
})

export class CustomerRequestComponent {

  @Input() article!: Product;

  submitted = output<void>();
  product: Product | null = null;
  idProduct: number = 0;
  email = '';
  isOpen = signal(true);
  productsSoldOut: Product[] = [];

  private logicRequest = inject(LogicRequestService);
  private productService = inject(ProductService);
  private emailService = inject(EmailService);
  private carouselService = inject(CarouselService);
  private _subDisponibilityProductSoldOut = Subscription.EMPTY;
  private _subsendEmailRequest = Subscription.EMPTY;

  ngOnInit() {
    this.product = this.logicRequest.selectedProduct();
    this.idProduct = this.product?.id ?? 0;
    this.loadProductsSoldOut();
  }

  // ALIMENTE LA LISTE DES SOLDOUT
  loadProductsSoldOut() {
    this._subDisponibilityProductSoldOut = this.productService.disponibilityProductSoldOut().subscribe({
      next: (result) => {
        this.productsSoldOut = result;
        this.productsSoldOut.forEach(p => {
          if (p.id === this.idProduct) {
            this.product = p;
          }
        })
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  OnDestroy() {
    this._subsendEmailRequest.unsubscribe();
    this._subDisponibilityProductSoldOut.unsubscribe();
  }

  submit(): void {
    if (!this.email) return;

    if (this.product !== null) {
      const contactData = {
        email: this.email,
        nom: this.product.name,
        sku: this.product.sku,
        marque: this.product.marque,
        size: this.product.size
      };

      this._subsendEmailRequest = this.emailService.sendEmailRequest(contactData).subscribe({
        next: (response) => {
          if (response) {
            alert('message sent successfully');
            this.email = '';
          }
        },
        error: () => {
          alert('message not sent, sorry');
        }
      })
    }
  }

  onOverlayClick($event: PointerEvent) {
    this.carouselService.setMode('standard');
  }

  closeManage() {
    this.carouselService.setMode('standard');
  }


}
