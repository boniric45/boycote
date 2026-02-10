import { AfterContentChecked, ChangeDetectorRef, Component, ElementRef, inject, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { MarqueService } from '../../services/marque.service';
import { Marque } from '../../models/marque';
import { Product } from '../../models/product';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { delay, isEmpty, Observable, Subject } from 'rxjs';
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

  panelMarquesIsOpen: boolean = false;
  marqueIsDisabled = false;

  panelVetementIsOpen: boolean = false;
  vetementIsDisabled = false;

  panelGenderIsOpen: boolean = false;
  genreIsDisabled = false;

  carouselStandardIsSelected:Boolean = true;
  carouselSortIsSelected:Boolean = false;
  carouselSearchIsSelected:Boolean = false;


  @ViewChild('carousel', { static: true }) carousel!: ElementRef;
  @ViewChildren('carousel__cell') cells!: QueryList<ElementRef>; // Alimente le carousel avec les infos du dom

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
  
  // Sélectionne le carousel en fonction de sa recherche
  carouselSearchList:boolean = false;
  carouselSelectList:boolean = false;
  carouselStandard:boolean = false;
  
  inputIsDisabled:boolean = false;
  btnSearchByMarqueIsDisabled:boolean = false;
  displayInput = '';
  displaySelect = '';
  // pagination 
  resultList:Product[] = [];

  nbPageTotal:number = 0;

  page:number = 1;

  ngOnInit(): void { this.initCarouselProduct(); }

  constructor(private cdRef: ChangeDetectorRef) {  }

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
    this.indexCarousel = 1;
    this.marqueService.getMarques().subscribe(m => this.marques = m); // récupère les marques

    this.manageCarousel(1); // Initialise sur le carousel standard

    this.productService.getProducts().pipe(delay(1000)).subscribe(p => {
      this.allProducts = p;

      for (let i = 0; i < 9; i++) {
        this.productCarousel.push(this.allProducts[i]);
      }

      if (this.productCarousel[8].idImage == 9) {
        this.loading = false;
        this.loadingCarousel = true;
      }
    })
  }

  // en fonction de la recherche du carousel
  manageCarousel(nb : number){
      switch(nb){

      case 1: // Standard
          this.carouselStandard = true;
          this.carouselSelectList = false;
          this.carouselSearchList = false;
          this.resetMarque();
          this.resetVetement();
          this.resetGender();   
          this.searchQuery = '';
        break;
      
      case 2: // Input
          this.carouselStandard = false;
          this.carouselSelectList = false;
          this.carouselSearchList = true;
          this.displaySelect = 'none';
        break;
      
      case 3: // List
          this.carouselStandard = false;
          this.carouselSelectList = true;
          this.carouselSearchList = false;
          this.inputIsDisabled = true;
          this.btnSearchByMarqueIsDisabled = true;     
          this.displayInput = 'none';
        break;
      
      default: // Standard
          this.carouselStandard = true;
          this.carouselSelectList = false;
          this.carouselSearchList = false;
          this.resetMarque();
          this.resetVetement();
          this.resetGender();   
          this.searchQuery = '';
        break;
    }
  }

 ////////////////////////  STANDARD   /////////////////////

    // Gère les boutons Carousel Standard
  startCarouselStandard(char: string): void {
    if (char == 'left') {
      this.prev();
    } else if (char == 'right') {
      this.next();
    }
  }

   // Gère le bouton suivant Carousel Standard
  next() {
    this.timeOutButtonDisabled();
    this.indexCarousel++;

    // vérification de l'index du carousel 
    const lastIndexCarousel = this.getLastIndex(this.productCarousel);

      const restProduct = this.allProducts.length - this.indexCarousel;
    //  console.log('Vignettes Restantes => ',restProduct);
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
  
  // Gère le bouton avant Carousel Standard
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

  getProductsByPage(list: Product[], page: number, pageSize: number = 9): Product[] {
  // 1. On récupère le max des idImage
  const maxId = Math.max(...list.map(p => p.idImage));

  // 2. On crée une map idImage -> produit
  const map = new Map(list.map(p => [p.idImage, p]));

  // 3. On calcule la plage d'idImage de la page
  const startId = (page - 1) * pageSize + 1;
  const endId = page * pageSize;

  const result: Product[] = [];

  for (let id = startId; id <= endId; id++) {
    if (map.has(id)) {
      result.push(map.get(id)!);
    } else {
      result.push({
        id,
        idImage: id,
        name: '',
        description: '',
        marque: '',
        type: '',
        gender: '',
        size: '',
        quantity: 0,
        stock: 0,
        ht: 0,
        tva: 0,
        ttc: 0,
        codeEan: '',
        pathPictureOne: '\\pictures\\vendu.png',
        pathPictureTwo: '',
        pathPictureThree: ''
      });
    }
  }

  return result;
  }


  engineCarouselInput() {
    this.indexCarousel= 0;
    this.resultList = [];

    // Recherche toutes les marques dans tous les produits et créer une liste 
    this.allProducts.forEach(p => {
      // Crée la liste avec les résultats
      if ( this.searchQuery === p.marque  ) {      
         this.resultList.push(p);
      } 
    });   

    this.productCarousel = this.resultList; // Appelé qu'une seule fois quand on clique sur le champ

    this.searchQuery = ''; // Réinitialise le champ 
   
  }
  

  // renvoyer une liste de numéro qui sera itérer par le bouton next
  calculNumberPage(productList:Product[]):number{
  let resultPage:any = productList.at(-1)?.idImage;
  return Math.ceil(resultPage / 9); //arrondi au chiffre supérieur
  }

  // Gère les boutons Carousel Search Input
  startCarouselInput(char: string): void {
    if (char == 'left') {
      this.inputPrev();
    } else if (char == 'right') {
      this.inputNext();
    }
  }

//////////////////////// END STANDARD   /////////////////////

///////////////////  INPUT   ////////////////////////


nextPage() {
  if (this.page < this.maxPage) {
    this.page++;
  } else {
    this.page = 1; // ou rester sur la dernière page si tu préfères
  }

  console.log("Page >", this.page);
}

prevPage() {
  const maxPage = Math.ceil(this.productCarousel.length / 9);
  this.page = this.page > 1 ? this.page - 1 : maxPage;
   console.log('Page > ',this.page);
}


inputNext() {
  const lastIndex = this.visibleItems.length - 1;
  this.indexCarousel++;

// Si on dépasse la dernière carte visible (index 8)
  if (this.indexCarousel > lastIndex) {
    this.indexCarousel = 0; 
    this.nextPage();
  }
}

inputPrev() {
this.indexCarousel--;
if (this.indexCarousel < 0) {
   this.prevPage(); 
   this.indexCarousel = 8; 
}
   // dernière carte de la nouvelle page 
}

// Fait la pagination pour le champ de recherche
get visibleItems(): Product[] {
  return this.getProductsByPage(this.productCarousel, this.page, 9);
}

// Vérifie le nombre de page
get maxPage(): number {
  if (!this.resultList.length) return 1;
  const maxId = Math.max(...this.resultList.map(p => p.idImage));
  return Math.ceil(maxId / 9);
}

///////////////////  END INPUT   ////////////////////////



/**********************   SELECT **********************/

  // Gère les boutons Carousel Select
  startCarouselSort(char: string): void {
    if (char == 'left') {
      this.sortPrev();
    } else if (char == 'right') {
      this.sortNext();
    }
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

  // Fonction Première lancé via un clic et lance la recherche une fois la liste fermée
  marquesIsOpen(bool: boolean) {
    if (!bool) {
      // volet ouvert
      this.manageCarousel(3);
    } else {
      // volet fermé
      this.listMarqueResult = [];

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
      this.manageCarousel(3);
    } else {
      this.listVetementResult = [];

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
      this.manageCarousel(3);
    } else {
      this.listGenreResult = [];
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
    let listResult:Product[] = [];
    this.page = 1;

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
            this.resultList.push(vet)
          }
        })
      });   

      this.productCarousel = this.resultList;
  }

  sortNext() {
    const lastIndex = this.visibleItemsSort.length - 1;
    this.indexCarousel++;

    // Si on dépasse la dernière carte visible (index 8)
    if (this.indexCarousel > lastIndex) {
      this.indexCarousel = 0;
      this.nextPageSort();
    }

  }

  sortPrev() {
    this.indexCarousel--;
    if (this.indexCarousel < 0) {
      this.prevPageSort();
      this.indexCarousel = 8;
    }
    // dernière carte de la nouvelle page 

  }

  nextPageSort() {
    if (this.page < this.maxPageSort) {
      this.page++;
    } else {
      this.page = 1; // ou rester sur la dernière page si tu préfères
    }
  }

  prevPageSort() {
    const maxPage = Math.ceil(this.productCarousel.length / 9);
    this.page = this.page > 1 ? this.page - 1 : this.maxPageSort;
  }

  // Vérifie le nombre de page
  get maxPageSort(): number {
    if (!this.resultList.length) return 1;
    const maxId = Math.max(...this.resultList.map(p => p.idImage));
    return Math.ceil(maxId / 9);
  }

  submitButtonSelect(){
    this.searchWithSelect();
      this.resetMarque();
      this.resetVetement();
      this.resetGender();   
  }

  get visibleItemsSort(): Product[] {    
  return this.getProductsByPage(this.productCarousel, this.page, 9);
  }


/********************************** END SELECT  ********************************* */

  searchWithQuery(){
    return this.productCarousel.filter(data => data.marque.toUpperCase().includes(this.searchQuery.toUpperCase()));
  }

  submitSearchByMarques(){
   this.engineCarouselInput();
  }
  // Click sur input
  inputClick(){
    this.manageCarousel(2);
  }

  // Réinitialise la page
  refreshList(){
    this.ngOnInit();
    this.displayInput = 'inline-flex';
    this.displaySelect = 'block';
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
