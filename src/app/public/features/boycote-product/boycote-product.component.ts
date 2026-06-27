import { CommonModule, NgStyle } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, inject, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product } from '../../../models/product';
import { ApiService } from '../../../services/api.service';
import { CartService } from '../../../services/cart.service';
import { ModalService } from '../../../services/modal.service';
import { ProductService } from '../../../services/product.service';
import { InformationsCardComponent } from '../../informations-card/informations-card.component';
import { ButtonReturnComponent } from "../button-return/button-return.component";
import { ComponentLeftComponent } from '../component-left/component-left.component';
import { ComponentRightComponent } from '../component-right/component-right.component';



@Component({
  selector: 'app-boycote-product',
  imports: [
    MatButtonModule,
    NgStyle,
    ComponentLeftComponent,
    ComponentRightComponent,
    CommonModule,
    InformationsCardComponent,
    ButtonReturnComponent,
],
  // changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './boycote-product.component.html',
  styleUrl: './boycote-product.component.scss',
})
export class BoycoteProductComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  private route: Router = inject(Router);
  private cartService = inject(CartService);
  private apiService = inject(ApiService);
  modalService = inject(ModalService);
  stock: number = 0;
  countPanier = 0;
  isDisplay = 'block';
  btnMacIsDisabled = '';
  product!: Product;
  productList: Product[] = [];
  cellWidth!: number;
  cellHeight!: number;
  listResult: Product[] = [];
  @ViewChild('carousel', { static: true }) carousel!: ElementRef;
  @ViewChildren('carousel__cell') cells!: QueryList<ElementRef>; // Alimente le carousel avec les infos du dom
  indexCarousel: number = 0;
  loadingCarousel = true;
  pictureRead: string = "";
  isDisabled: boolean = false;
  isLandscape: boolean = true;

  private subscription: Subscription = new Subscription();

  constructor(
    public data: ProductService,
    private cdRef: ChangeDetectorRef,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {

    this.product = this.data.product; // Récupère le produit du parent Home
    // si on réactualise redirige vers la page home sinon crée les produits du carousel
    if (!this.product) {
      this.route.navigate(['home']);
    } else {
      this.createCarouselWithProduct(this.product);

    }

    this.cartService.count$.subscribe(value => this.countPanier = value);
  }

  ngAfterContentChecked(): void { // Peut ralentir l'appli
    if (this.carousel) {
      this.cellWidth = this.carousel.nativeElement.offsetWidth;
      this.cellHeight = this.carousel.nativeElement.offsetHeight;
    }
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  createCarouselWithProduct(prod: Product) {
    console.log(prod);
  }

  get cellCount() {
    return this.cells ? this.cells.length : this.cells;
  }

  standardPrev() {
    this.indexCarousel--;
  }

  standardNext() {
    this.indexCarousel++;
  }

  // Gère les boutons Carousel Standard
  startCarouselStandard(char: string): void {
    if (char == 'left') {
      this.standardPrev();
    } else if (char == 'right') {
      this.standardNext();
    }
  }

  // Gère le style du Carousel
  getStyle(index: number) {
    if (!this.cellCount) {
      // this.route.navigate(['product']);
      return null;
    } else {
      const angle = (index - this.indexCarousel) * 2 * Math.PI / this.cellCount; // mettre 3 pour le carousel mobile
      const scale = ((75) + 20 * Math.cos(angle)) / 110;
      return {
        left: -30 + 350 * Math.sin(angle) + 'px', // 150 de base
        transform: 'scale(' + scale + ')',
        position: 'absolute',
        "z-index": Math.floor(100 * scale)
      }
    }

  }

  checkStock(stock: number) {
    if (stock === 0) {
      this.modalService.open();
    }
  }

  onEmailSubmit(email: string) {

    this.http.post('https://www.xn--boycot-gva.fr/api/alert.php', {
      email: email,
      product: this.product
    }).subscribe({
      next: res => console.log(res),
      error: err => console.error(err)
    });

    this.modalService.close();
  }

  addPanier() {
    this.isDisplay = 'none'; // désactive le bouton
    this.btnMacIsDisabled = 'margin-top: 75px;'; // Garde l'espace qu'occupait le bouton
  }
}
