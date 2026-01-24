import { AfterContentChecked, ChangeDetectorRef, Component, ElementRef, inject, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { MarqueService } from '../../services/marque.service';
import { Marque } from '../../models/marque';
import { Product } from '../../models/product';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { SelectedDirective } from '../../directive/selected.directive';
import { Router } from '@angular/router';
import { delay, Observable, Subject } from 'rxjs';
import { CommonModule, NgStyle } from '@angular/common';
import { ComponentLeftComponent } from '../component-left/component-left.component';
import { ComponentRightComponent } from '../component-right/component-right.component';
import { FooterComponent } from "../footer/footer.component";
import { ProgressbarComponent } from '../progressbar/progressbar.component';

@Component({
  selector: 'app-boycote',
  imports: [
    MatButtonModule, MatDividerModule, MatIconModule,
    MatFormFieldModule, MatSelectModule, FormsModule,
    ReactiveFormsModule, ComponentRightComponent,
    ComponentLeftComponent, CommonModule, NgStyle, FormsModule,
    MatButtonModule, FooterComponent, ProgressbarComponent
],
  templateUrl: './boycote.component.html',
  styleUrl: './boycote.component.scss',
})
export class BoycoteComponent implements AfterContentChecked, OnDestroy, OnInit {

  private productService = inject(ProductService);
  private marqueService = inject(MarqueService);
  vetementsList: string[] = ['Haut', 'Bas', 'Chaussure', 'Accessoire'];
  genreList: string[] = ['Femme', 'Homme'];
  marques: Marque[] = [];

  allProducts: Product[] = [];
  indexCarousel: number = 1;

  listMarqueResult: Product[] = [];
  listVetementResult: Product[] = [];
  listGenreResult: Product[] = [];

  reinitSelectMarque: string = '';
  reinitSelectVetement: string = '';
  reinitSelectGender: string = '';

  vetementListSelected: string[] = [];
  marquesListSelected: string[] = [];
  genreListSelected: string[] = [];

  listGlobal: Product[] = [];
  inputSelected!: string[];

  buttonLeftIsDisabled = 'btnDisabled';

  panelMarquesIsOpen: boolean = false;
  marqueIsDisabled = false;

  panelVetementIsOpen: boolean = false;
  vetementIsDisabled = false;

  panelGenderIsOpen: boolean = false;
  genreIsDisabled = false;


  @ViewChild('carousel', { static: true }) carousel!: ElementRef;
  @ViewChildren('carousel__cell') cells!: QueryList<ElementRef>; // Alimente le carousel avec les infos du dom

  // disabledButton: Record<string,string> = {}

  // setDisabledButton(){
  //   this.disabledButton = {
  //     'disabled': this.selectedIndexImage == 1 ? 'true' : 'false'  
  //   }
  // }

  product: Product | undefined;
  productActive!: Product;
  product$!: Observable<Product[]>;
  searchQuery = '';
  cellWidth!: number;
  cellHeight!: number;
  isHorizontal: boolean = true;
  rotateFn = this.isHorizontal ? 'rotateY' : 'rotateX';
  radius!: number;
  theta!: number;
  disabled: boolean = false;

  numberProduct: number = 0;
  private ngUnsubscribe = new Subject<void>();
  private route: Router = inject(Router);
  productView: string = '';
  loadingCarousel = false;
  loading = false;
  productCarousel:Product[] = [];

  ngOnInit(): void {
     this.initCarouselProduct();  
  }

  constructor(private cdRef: ChangeDetectorRef) {}
  ngAfterContentChecked(): void { // Peut ralentir l'appli
    if (this.carousel) 
    {
      this.cellWidth = this.carousel.nativeElement.offsetWidth;
      this.cellHeight = this.carousel.nativeElement.offsetHeight;
    }
    this.cdRef.detectChanges();
  }
  
  // reset la liste déroulante
  resetMarque() { this.reinitSelectMarque = ''; }
  resetVetement() { this.reinitSelectVetement = ''; }
  resetGender() { this.reinitSelectGender = ''; }

  // Initialise le carousel
  initCarouselProduct() {
    this.loading = true;
    this.loadingCarousel = false;
    this.productCarousel = [];
    this.marqueService.getMarques().subscribe(m => this.marques = m);

    this.productService.getProducts().pipe(delay(1000)).subscribe(p => {
      this.allProducts = p;

      for (let i = 0; i < 9; i++) {
        this.productCarousel.push(this.allProducts[i]);
      }

      if (this.productCarousel[8].idImage == 9) {
        this.marquesIsOpen(true);
        this.loading = false;
        this.loadingCarousel = true;
      }
    })
  }

  // Récupère la saisie utilisateur marque
  getMarquesSelectedUser($event: MatSelectChange<string[]>) {
    // Récupère les valeurs de la liste du template sélectionné
    this.marquesListSelected = $event.value;
  }
  // Récupère la saisie utilisateur vetements 
  getTypeSelectedUser($event: MatSelectChange<string[]>) {
    this.vetementListSelected = $event.value;
  }
  // Récupère la saisie utilisateur genre
  getGenderSelectedUser($event: MatSelectChange<string[]>) {
    this.genreListSelected = $event.value;
  }

// nettoyer les listes 

  // Fonction Première lancé via un clic et lance la recherche une fois la liste fermée
  marquesIsOpen(bool: boolean) {
    if (!bool) {
      // volet ouvert
   //   this.panelMarquesIsOpen = true;
      // réinitialise les listes déroulantes  

    } else {
      // volet fermé
      this.listMarqueResult = [];
      this.panelMarquesIsOpen = false; // desactive la liste
      this.vetementIsDisabled = false;
      if (this.marquesListSelected.length == 0) {
        this.listMarqueResult = this.productCarousel; // alimente la liste déroulante
      } else {
        console.log(this.productCarousel); // 9 articles 
        console.log('All > ', this.allProducts); // full 

        this.marquesListSelected.forEach(m => {
          this.productCarousel.forEach(prod => {
            if (prod.marque == m) {
              this.listMarqueResult.push(prod);
            }
          })
        })
      }
      this.productCarousel = [];
      this.productCarousel = this.listMarqueResult;
    }
  }

  // Fonction Première lancé via un clic et lance la recherche une fois la liste fermée
  vetementIsOpen(bool: boolean) {
    if (!bool) {
  //    this.panelVetementIsOpen = true;
    //  this.marqueIsDisabled = true;
    } else {
      this.listVetementResult = [];
      this.panelVetementIsOpen = false;
      this.vetementIsDisabled = true;
      this.genreIsDisabled = false;

      // Si la liste de sélection est vide je renvoi la liste des marques
      if (this.vetementListSelected.length == 0) {
        this.listVetementResult = this.listMarqueResult;
        console.log(this.listVetementResult);
      } else {
        this.listMarqueResult.forEach(marq => {
          this.vetementListSelected.forEach(vetUser => {
            if (marq.type == vetUser) {
              this.listVetementResult.push(marq);
            }
          })
        })
      }
      this.productCarousel = [];
      this.productCarousel = this.listVetementResult;
    }
  }

  // Fonction Première lancé via un clic et lance la recherche une fois la liste fermée
  genderIsOpen(bool: boolean) {
    if (!bool) {
   //   this.panelGenderIsOpen = true;
    } else {
      this.listGenreResult = [];
      this.panelGenderIsOpen = false;
      this.genreIsDisabled = true;
      this.marqueIsDisabled = false;

      if (this.genreListSelected.length == 0) {
        this.listGenreResult = this.listVetementResult;
      } else {
        this.productCarousel = [];
        this.listVetementResult.forEach((vet) => {
          this.genreListSelected.forEach((genre) => {
            if (vet.gender === genre) {
              this.productCarousel.push(vet);
            }
          })
        })
      }
    }
  }

  searchWithSelect() {
    this.productCarousel = [];
    this.listMarqueResult = [];
    this.listVetementResult = [];
    this.listGenreResult = [];

      this.marquesListSelected.forEach(m => {
        this.allProducts.forEach(product => {
        if (product.marque === m) {
          this.listMarqueResult.push(product);
        }        
      });
    });

      this.vetementListSelected.forEach(v => {
        this.listMarqueResult.forEach(marq => {
          if(marq.type === v ){
            this.listVetementResult.push(marq);
          }
        });
      });

      this.genreListSelected.forEach(g => {
        this.listVetementResult.forEach(vet=>{
          if(vet.gender === g){
            this.productCarousel.push(vet)
          }
        })
      });   

    console.log(this.productCarousel);
    
  }

  searchWithQuery(){
    return this.productCarousel.filter(data => data.marque.toUpperCase().includes(this.searchQuery.toUpperCase()));
  }

  submitButtonSelect(){

    this.searchWithSelect();
   

      // this.resetMarque();
      // this.resetVetement();
      // this.resetGender();
    
  }

  // Gère le style du Carousel
  getStyle(index: number) {
    if (!this.cellCount)
      return null;
    const angle = (index - this.indexCarousel) * 2 * Math.PI / this.cellCount; // mettre 3 pour le carousel mobile
    const scale = ((75) + 20 * Math.cos(angle)) / 110;
    return {
      left: -30 + 250 * Math.sin(angle) + 'px', // 150 de base
      transform: 'scale(' + scale + ')',
      position: 'absolute',
      "z-index": Math.floor(100 * scale)
    }
  }

  get cellCount() {
    return this.cells ? this.cells.length : this.cells;
  }

  // Gère les boutons
  startCarousel(char: string): void {
    if (char == 'left') {
      this.prev();
    } else if (char == 'right') {
      this.next();
    }
  }

  readViewProduct() {
    // Image du carousel active = p 
    this.productCarousel.forEach(p => {
      if (this.indexCarousel === p.idImage) {
        console.log('<=== Read View ===> ', p);
        this.productView = ' ' + p.name + ' - ' + p.marque;
        this.productActive = p;
      }
    });
  }

  readViewProductByIdImage(idImage: number): Product {
    this.productService.getProductByIdImage(idImage).subscribe(p => {
      this.productActive = p;
    })
    return this.productActive;
  }

  getLastIndex(productCarousel: Product[]): number {
    let found: any;
    if (productCarousel.length != 0 || productCarousel != null) {
      found = this.productCarousel.at(-1)?.idImage; // récupère le dernier index
    }
    return found;
  }

  getFirstIndex(productCarousel: Product[]): number {
    let found: any;
    if (productCarousel.length != 0 || productCarousel != null) {
      found = this.productCarousel.at(0)?.idImage; // récupère le dernier index
    }
    return found;
  }

  // Gère le bouton suivant
  next() {
    
    this.timeOutButtonDisabled();
    this.indexCarousel++;

    // vérification de l'index du carousel 
    const lastIndexCarousel = this.getLastIndex(this.productCarousel);

      const restProduct = this.allProducts.length - this.indexCarousel;
      console.log(restProduct);
      // vérifie que le nombre de vignette à afficher est supérieure à 9
      if((this.indexCarousel == lastIndexCarousel + 1) && restProduct < 9){

        console.log('pas assez ');
              this.productCarousel = [];
      for (let i = 0; i < 9; i++) { 
        this.productCarousel.push(this.allProducts[i]);
      }

      this.indexCarousel = this.productCarousel[0].idImage;

      } 

    // Si le compteur est égal au dernier index de product carousel
    else if (this.indexCarousel == lastIndexCarousel + 1) {      
      this.productCarousel = this.getCarouselNext(this.allProducts, this.indexCarousel);
      this.productCarousel.sort((n1, n2) => n1.idImage - n2.idImage);

    } //  si je suis à la fin de la liste allproduct, charge la liste du début
    else if (this.indexCarousel == this.allProducts.length) {   

      this.productCarousel = [];
      for (let i = 0; i < 9; i++) { 
        this.productCarousel.push(this.allProducts[i]);
      }

      this.indexCarousel = this.productCarousel[0].idImage;
    } 

    this.rotateCarousel();
    this.timeOutButtonEnabled();
  }

  getCarouselNext(allProduct:Product[],indexCarousel:number):Product[]{
   
    let result:Product[] = [];
    // Itère sur la liste des produits et crée ProductCarousel
    for(let i=indexCarousel-1;i<indexCarousel+9;i++){
        result.push(allProduct[i])
    } 
    return result;
  }

  getCarouselPrev(allProduct:Product[],indexCarousel:number):Product[]{
   this.productCarousel = [];
    let result:Product[] = [];
    // Itère sur la liste des produits et crée ProductCarousel
    for(let i=0;i<indexCarousel+8;i++){
        result.push(allProduct[i])
    } 
    return result;
  }
  // Gère le bouton avant
  prev() {

    // Signalement : 
    this.timeOutButtonDisabled();
    this.indexCarousel--;

    // vérification de l'index du carousel 
    const lastIndexCarousel = this.getLastIndex(this.productCarousel);
    const firstIndexCarousel = this.getFirstIndex(this.productCarousel);
    
    if(this.indexCarousel == 0){     
      this.indexCarousel = lastIndexCarousel;   
    } 
    
    else if(this.indexCarousel == 9){
      this.productCarousel = this.getCarouselPrev(this.allProducts, 1);
    }
    
    else if(this.indexCarousel==firstIndexCarousel-1) {
      console.log('Index Carousel > ',this.indexCarousel,'First Index > ',firstIndexCarousel,'Last Index > ',lastIndexCarousel);
      this.productCarousel = this.getCarouselNext(this.allProducts, 10);
      this.productCarousel.sort((n1, n2) => n1.idImage - n2.idImage);
    } 
    this.rotateCarousel();
    this.timeOutButtonEnabled();
  }

  // Désactive le bouton après click
  timeOutButtonDisabled() {
    setTimeout(() => {
      this.disabled = true;
    }, 0);
  }
  // Réactive le bouton après 1 Seconde 
  timeOutButtonEnabled() {
    setTimeout(() => {
      this.disabled = false;
    }, 950);
  }

  // Fait tourner le carousel
  rotateCarousel() {
    this.indexCarousel / this.cellCount * -360;
  }

  // Dirige vers la page du Produit 
  btnView(product: string) {
    this.route.navigate(['product']);
  }

  ngOnDestroy(): void {
    // desabonne le product$
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
