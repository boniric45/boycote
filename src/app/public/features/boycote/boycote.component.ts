import { AfterContentChecked, ChangeDetectorRef, Component, ElementRef, inject, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren, ViewEncapsulation, signal, computed, HostListener, effect,} from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { Router, RouterLink } from '@angular/router';
import { delay, Observable, Subject } from 'rxjs';
import { CommonModule, NgStyle } from '@angular/common';
import { Marque } from '../../../models/marque';
import { Product } from '../../../models/product';
import { ApiService } from '../../../services/api.service';
import { CartService } from '../../../services/cart.service';
import { CookieService } from '../../../services/cookie.service';
import { ProductService } from '../../../services/product.service';
import { FooterComponent } from '../../footer/footer.component';
import { ProgressbarComponent } from '../../progressbar/progressbar.component';
import { CookiesComponent } from '../cookies/cookies.component';
import { CarouselStandardComponent } from "../carousel/carousel-standard/carousel-standard.component";
import { CarouselInputComponent } from "../carousel/carousel-input/carousel-input.component";
import { CarouselSelectComponent } from "../carousel/carousel-select/carousel-select.component";


@Component({
  selector: 'app-boycote',
  imports: [
    MatButtonModule, MatDividerModule, MatIconModule,
    MatFormFieldModule, MatSelectModule, FormsModule,
    ReactiveFormsModule, CommonModule, NgStyle, FormsModule,
    MatButtonModule, FooterComponent, ProgressbarComponent,
    CookiesComponent,
    MatSelectModule,
    RouterLink,
    CarouselStandardComponent,
    CarouselInputComponent,
    CarouselSelectComponent
],
  templateUrl: './boycote.component.html',
  styleUrl: './boycote.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class BoycoteComponent implements AfterContentChecked, OnDestroy, OnInit {

  /**
   * SERVICES
   */
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private apiService = inject(ApiService);
  private cookiesService = inject(CookieService);
  private cdRef = inject(ChangeDetectorRef);


  // ajout panier
  countPanier = 0;
  product!: Product;
  vetementsList: string[] = ['Haut', 'Bas', 'Chaussures', 'Accessoires'];
  genreList: string[] = ['Femme', 'Homme'];
  
  /**
   * STYLES
   */
  titleCarousel = {color:'red','text-align':'center',margin:'1px',padding:'1px','font-size':'48px'};

  /** ------------------------------
   *  SIGNALS
   * ------------------------------ */
  marques = signal<Marque[]>([]);
  products = signal<Product[]>([]); //Writable
  types = signal(this.vetementsList);
  genders = signal(this.genreList);
  selectedMarques = signal<string[]>([]);
  selectedTypes = signal<string[]>([]);
  selectedGenders = signal<string[]>([]);
  searchCustomer = signal<string[]>([]);
 
  /** Dropdown states */
  isOpenMarques = signal(false);
  isOpenTypes = signal(false);
  isOpenGenders = signal(false);

  /** Cookies */
  isCookiesIsNotSaved = signal(true);

  /** Labels dynamiques */
  labMarques = computed(() => this.labelOf(this.selectedMarques(), 'Marques'));
  labTypes = computed(() => this.labelOf(this.selectedTypes(), 'Types'));
  labGenders = computed(() => this.labelOf(this.selectedGenders(), 'Genres'));

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
  loadingPb = false;
  productCarousel:Product[] = [];
  
  // Sélectionne le carousel en fonction de sa recherche
  carouselSearchList:boolean = false;
  carouselSelectList:boolean = false;
  carouselStandard:boolean = false;
  
  inputIsDisabled:boolean = false;
  btnSearchByMarqueIsDisabled:boolean = false;
  displayInput = '';
  displaySelect = '';
  displayNoResult:boolean = false;
  noResult = 'No Results';
  // pagination 
  resultList:Product[] = [];
  page:number = 1;
  display = 'block';


  ngOnInit(): void { 

    // RECUPERATION DES MARQUES
    this.loadMarques();
    
    // RECUPERATION DE TOUS LES PRODUITS
    this.loadProducts();

    // COOKIES
    const consent = this.cookiesService.get('cookie_consent');
    if (consent) {
      this.isCookiesIsNotSaved.set(false);
    }

    this.manageCarousel(1); // Lance le carousel standard

  //  this.cartService.count$.subscribe(value => this.countPanier = value);
       
  }


  loadMarques() {
    this.apiService.getMarques().subscribe(m => {
      this.marques.set(m);
      console.log(this.marques());
    });
  }

  loadProducts() {
    this.apiService.getProducts().subscribe(p => {
      this.products.set(p);
      console.log(this.products());
    });
  }

  ngAfterContentChecked(): void { // Peut ralentir l'appli
    if (this.carousel) 
    {
      this.cellWidth = this.carousel.nativeElement.offsetWidth;
      this.cellHeight = this.carousel.nativeElement.offsetHeight;
    }
    this.cdRef.detectChanges();
  }
  
  launchCarouselStandard(){

    this.loadingPb = true; // lance la progress bar
    this.productCarousel = []; // initialise le carousel
    this.display = 'none'; // cache les éléments
    this.displayNoResult = false;
    // Récupère tous les produits de la base
    this.apiService.getProducts().pipe(delay(1000)).subscribe(p => {
      
      this.allProducts = p;

        // Si la liste des produits n'est pas vide j'arrete le sablier
      if(this.allProducts){
        this.loadingPb = false;
        this.loadingCarousel = true;
        // Créer resultList et ProductCarousel 
        this.engineCarouselStandard(this.allProducts);
        console.log(this.allProducts);
        
      } 
      
      if(!this.allProducts.length){
        this.loadingPb = false;
        this.loadingCarousel = false;
        this.displayNoResult = true;
      } 
      
      
      
    })


}

  // reset la liste déroulante
  resetMarque() { this.selectedMarques.set([]); }
  resetVetement() { this.selectedTypes.set([]); }
  resetGender() { this.selectedGenders.set([]); }

  // Initialise le carousel
  initCarouselProduct() {
    // Lance le sablier et l'affiche
    this.manageCarousel(1); // Initialise sur le carousel standard  
  }



      /** ------------------------------
   *  LABEL UTILITY
   * ------------------------------ */
  private labelOf(list: string[], base: string): string {
    if (list.length === 0) return base;
    if (list.length === 1) return list[0];
    return `${base}: ${list.length} sélectionnés`;
  }

  /** ------------------------------
   *  DROPDOWNS
   * ------------------------------ */
  closeAll() {
    this.isOpenMarques.set(false);
    this.isOpenTypes.set(false);
    this.isOpenGenders.set(false);
  }

  toggleMarquesDropdown(event: Event) {
    event.stopPropagation();
    this.manageCarousel(3);
    this.isOpenMarques.update(v => !v);
    this.isOpenTypes.set(false);
    this.isOpenGenders.set(false);
  }

  toggleTypesDropdown(event: Event) {
    event.stopPropagation();
    this.isOpenTypes.update(v => !v);
    this.isOpenMarques.set(false);
    this.isOpenGenders.set(false);
  }

  toggleGendersDropdown(event: Event) {
    event.stopPropagation();
    this.isOpenGenders.update(v => !v);
    this.isOpenMarques.set(false);
    this.isOpenTypes.set(false);
  }

  toggleMarque(name: string, event: Event) {
    event.stopPropagation();
    this.toggleInSignal(this.selectedMarques, name);
  }

  toggleType(name: string, event: Event) {
    event.stopPropagation();
    this.toggleInSignal(this.selectedTypes, name);
  }

  toggleGender(name: string, event: Event) {
    event.stopPropagation();
    this.toggleInSignal(this.selectedGenders, name);
  }

  private toggleInSignal(sig: any, name: string) {
    sig.update((list: string[]) =>
      list.includes(name) ? list.filter(x => x !== name) : [...list, name]
    );
  }

  /**
   * GESTION DE LA RECHERCHE
   * @param nb 
   */
  manageCarousel(nb : number){
      switch(nb){
      case 1: // Standard
          this.carouselStandard = true;
          this.carouselSelectList = false;
          this.carouselSearchList = false;
          this.launchCarouselStandard();
          this.resetMarque();
          this.resetVetement();
          this.resetGender();   
          this.searchQuery = '';                       
        break;
      
      case 2: // Input
          this.carouselStandard = false;
          this.carouselSelectList = false;
          this.carouselSearchList = true;
          this.resetMarque();
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
      this.standardPrev();
    } else if (char == 'right') {
      this.standardNext();
    }
  }

  // Crée une nouvelle liste avec les résultats et ajoute des images fictives   
  getProductsByPage(list: Product[], page: number, pageSize: number = 9): Product[] {

  // 1. On récupère le max des idImage
  const maxId = Math.max(...list.map(p => p.id));

  // 2. On crée une map idImage -> produit
  const map = new Map(list.map(p => [p.id, p]));

  // 3. On calcule la plage d'idImage de la page
  const startId = (page - 1) * pageSize + 1;
  const endId = page * pageSize;

  const result: Product[] = [];

  for (let id = startId; id <= endId; id++) {
    if (map.has(id)) {
      result.push(map.get(id)!);
    } else {
      // result.push({
      //   id,
      //   name: '',
      //   description: '',
      //   marque: '',
      //   type: '',
      //   gender: '',
      //   size: '',
      //   sku: '',
      //   stock: 0,

      //   pathPictureOne: '\\pictures\\vendu.png',
      //   pathPictureTwo: '',
      //   pathPictureThree: '',
      //   pathPictureFour:'',
      //   pathPictureFive:''
      // });
    }
  }
  return result;
  }
    
  engineCarouselStandard(allProd:Product[]) {
    this.indexCarousel = 0;
    this.resultList = [];

    // // Recherche toutes les marques dans tous les produits et créer une liste 
     allProd.forEach(p => {
       this.resultList.push(p);
     });   
     this.productCarousel = this.resultList; // Appelé qu'une seule fois quand on clique sur le champ  
     console.log(this.productCarousel);
          
  }

  standardNext() {
    const lastIndex = this.visibleItemsStandard.length - 1;
    this.indexCarousel++;
    // Si on dépasse la dernière carte visible (index 8)
    if (this.indexCarousel > lastIndex) {
      this.indexCarousel = 0;
      this.nextPageStandard();
    }

  }

  standardPrev() {
    this.indexCarousel--;
    if (this.indexCarousel < 0) {
      this.prevPageStandard();
      this.indexCarousel = 8;
    }    
    // dernière carte de la nouvelle page 
  }

  nextPageStandard() {
    if (this.page < this.maxPage) {
      this.page++;      
    } else {
      this.page = 1; 
    }

  }

  prevPageStandard() {
    const maxPage = Math.ceil(this.productCarousel.length / 9);
    this.page = this.page > 1 ? this.page - 1 : maxPage;     
  }
  
  get visibleItemsStandard(): Product[] {           
  return this.getProductsByPage(this.resultList, this.page, 9);
  }
    // Vérifie le nombre de page
  get maxPageStandard(): number {
    if (!this.resultList.length) return 1;
    const maxId = Math.max(...this.resultList.map(p => p.id));
    return Math.ceil(maxId / 9);
  }
  
  //////////////////////// END STANDARD   /////////////////////
  
  
  
  ///////////////////  INPUT   ////////////////////////
  
  engineCarouselInput() {
    this.indexCarousel= 0;
    this.resultList = [];

    // Recherche toutes les marques dans tous les produits et créer une liste 
    this.allProducts.forEach(p => {
      // Crée la liste avec les résultats
      if ( this.searchQuery.toUpperCase() === p.marque  ) {      
         this.resultList.push(p);
      } 
    });   

    this.productCarousel = this.resultList; // Appelé qu'une seule fois quand on clique sur le champ

    this.searchQuery = ''; // Réinitialise le champ 
  }

  // Gère les boutons Carousel Search Input
  startCarouselInput(char: string): void {
    if (char == 'left') {
      this.inputPrev();
    } else if (char == 'right') {
      this.inputNext();
    }
  }

nextInputPage() {
  if (this.page < this.maxPage) {
    this.page++;
  } else {
    this.page = 1; // ou rester sur la dernière page si tu préfères
  }
}

prevInputPage() {
  const maxPage = Math.ceil(this.productCarousel.length / 9);
  this.page = this.page > 1 ? this.page - 1 : maxPage;
}


inputNext() {
  const lastIndex = this.visibleItems.length - 1;
  this.indexCarousel++;

// Si on dépasse la dernière carte visible (index 8)
  if (this.indexCarousel > lastIndex) {
    this.indexCarousel = 0; 
    this.nextInputPage();
  }
}

inputPrev() {
this.indexCarousel--;
if (this.indexCarousel < 0) {
   this.prevInputPage(); 
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
  const maxId = Math.max(...this.resultList.map(p => p.id));
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
    const maxId = Math.max(...this.resultList.map(p => p.id));
    return Math.ceil(maxId / 9);
  }

  submitButtonSelect(){
    this.searchWithSelect();
      this.resetMarque();
      this.resetVetement();
      this.resetGender();
      this.manageCarousel(3); // LANCE LE CAROUSEL SELECT   
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


  readViewProduct(product:Product){
    this.productService.product = product; // Injecte les infos dans ProductService
    this.route.navigateByUrl('product');
  }
  

  getLastIndex(productCarousel: Product[]): number {
    let found: any;
    if (productCarousel.length != 0 || productCarousel != null) {
      found = this.productCarousel.at(-1)?.id; // récupère le dernier index
    }
    return found;
  }

  getFirstIndex(productCarousel: Product[]): number {
    let found: any;
    if (productCarousel.length != 0 || productCarousel != null) {
      found = this.productCarousel.at(0)?.id; // récupère le dernier index
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

  addPanier(){
  this.cartService.add(this.product);
 }

  isSelected(name: string): boolean {    
    return this.selectedMarques().includes(name);
  }

  @HostListener('document:click')
  onClickOutside() {
    this.closeAll();
  }

  

}
