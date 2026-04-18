   import { CommonModule, NgStyle } from '@angular/common';
import { Component, computed, HostListener, inject, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { Router, RouterLink } from '@angular/router';
import { Marque } from '../../../models/marque';
import { Product, ProductFilter } from '../../../models/product';
import { ApiService } from '../../../services/api.service';
import { CartService } from '../../../services/cart.service';
import { CookieService } from '../../../services/cookie.service';
import { ProductService } from '../../../services/product.service';
import { FooterComponent } from '../../footer/footer.component';
import { CarouselInputComponent } from "../carousel/carousel-input/carousel-input.component";
import { CarouselListComponent } from '../carousel/carousel-list/carousel-list.component';
import { CarouselStandardComponent } from "../carousel/carousel-standard/carousel-standard.component";
import { CookiesComponent } from '../cookies/cookies.component';
import { CartComponent } from "../../cart/cart.component";
import { HamburgerComponent } from "../hamburger/hamburger.component";


@Component({
  selector: 'app-boycote',
  imports: [
    MatButtonModule, MatDividerModule, MatIconModule,
    MatFormFieldModule, MatSelectModule, FormsModule,
    ReactiveFormsModule, CommonModule, NgStyle, FormsModule,
    MatButtonModule, FooterComponent,
    CookiesComponent,
    MatSelectModule,
    CarouselStandardComponent,
    CarouselInputComponent,
    CarouselListComponent,
    CartComponent,
    HamburgerComponent
],
  templateUrl: './boycote.component.html',
  styleUrl: './boycote.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class BoycoteComponent implements OnInit {

  /**
   * SERVICES
   */
  private cartService = inject(CartService);
  private apiService = inject(ApiService);
  private cookiesService = inject(CookieService);
  private route = inject(Router);
  private productService = inject(ProductService);

  // ajout panier
  countPanier = 0;
  product!: Product;
  vetementsList: string[] = ['Haut', 'Bas', 'Chaussures', 'Accessoires'];
  genreList: string[] = ['Femme', 'Homme'];
  

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
  searchSubmitted = signal(false);
  searchSubmittedList = signal(false);
  

    /** ------------------------------
   *  DROPDOWN STATES
   * ------------------------------ */
  isOpenMarques = signal(false);
  isOpenTypes = signal(false);
  isOpenGenders = signal(false);

    /** ------------------------------
   *  COOKIES
   * ------------------------------ */
  isCookiesIsNotSaved = signal(true);

    /** ------------------------------
   *  LABELS DYNAMIQUES
   * ------------------------------ */
  labMarques = computed(() => this.labelOf(this.selectedMarques(), 'Marques'));
  labTypes = computed(() => this.labelOf(this.selectedTypes(), 'Types'));
  labGenders = computed(() => this.labelOf(this.selectedGenders(), 'Genres'));

    /** ------------------------------
   *  STYLE
   * ------------------------------ */

  reinitSelectMarque: string = '';
  reinitSelectVetement: string = '';
  reinitSelectGender: string = '';

  vetementListSelected: string[] = [];
  marquesListSelected: string[] = [];
  genreListSelected: string[] = [];

  inputSelected!: string[];
  searchQuery = signal(''); // CE QUE TAPE L'UTILISATEUR
  searchInput = signal(''); // CE QUI DECLENCHE REELLEMENT LA RECHERCHE
  numberProduct: number = 0;

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
  displayLogoMobile:boolean = true;
  displaySearchMobile:boolean = false;
  displaySearch:boolean = true;
  displayInput = '';
  displaySelect = 'visible';
  displayDropdown = 'visible';
  displayNoResult:boolean = false;
  noResult = 'No Results';
  // pagination 
  resultList:Product[] = [];
  page:number = 1;
  display = 'visible';
  searchInputValue = '';

  filtered: Product[] = [];

  criteria: ProductFilter = {
    marque: [],
    type: [],
    gender: []
  };


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
    this.cartService.count$.subscribe(value => this.countPanier = value);
  }

  applyFilters() {
    this.filtered = this.productService.filterProducts({
      marque: this.selectedMarques(),
      type: this.selectedTypes(),
      gender: this.selectedGenders()
    });
  }

  onMarquesChange(values: string[]) {
    this.selectedMarques.set(values);  
  }

  onTypesChange(values: string[]) {
    this.selectedTypes.set(values);
  }

  onGenresChange(values: string[]) {
    this.selectedGenders.set(values);
  }

  // ALIMENTE MARQUES 
  loadMarques() {
    this.apiService.getMarques().subscribe(m => {
      this.marques.set(m);
    });
  }

  // ALIMENTE PRODUIT
  loadProducts() {
    this.apiService.getProducts().subscribe(p => {
      this.products.set(p);
      this.productService.allProducts = p; // Stocke dans le service pour pouvoir filtrer ensuite
    });
  }

  launchCarouselStandard(){
    this.loadingPb = true; // lance la progress bar
    this.productCarousel = []; // initialise le carousel
    this.display = 'hidden'; // cache les éléments
    this.displayNoResult = false;

    setTimeout(()=> {

        // Si la liste des produits n'est pas vide j'arrete le sablier
      if(this.products()){
        this.loadingPb = false;
      } 
      
      if(!this.products().length){
        this.loadingPb = false;
        this.loadingCarousel = false;
        this.displayNoResult = true;
      } 
    },1000);
  }

  // reset la liste déroulante
  resetMarque() { this.selectedMarques.set([]); }
  resetVetement() { this.selectedTypes.set([]); }
  resetGender() { this.selectedGenders.set([]); }

  hamburgerClicked() {

    if(this.displayLogoMobile){
       this.displayLogoMobile = false;
       this.displaySearchMobile = true;
    } else {
      this.displaySearchMobile = false;
      this.displayLogoMobile = true;
    }

    
  //  window.innerWidth < 365 ? (this.hiddenLogo) = false : true ;
  }

  

  updateSearch(value: string){
    this.searchQuery.set(value);
  }

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
    this.manageCarousel(4); 
    event.stopPropagation();
    this.isOpenMarques.update(v => !v);
    this.isOpenTypes.set(false);
    this.isOpenGenders.set(false);

  }

  toggleTypesDropdown(event: Event) {
    this.manageCarousel(4); 
    event.stopPropagation();
    this.isOpenTypes.update(v => !v);
    this.isOpenMarques.set(false);
    this.isOpenGenders.set(false);
  }

  toggleGendersDropdown(event: Event) {
    this.manageCarousel(4); 
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
   * 
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
          this.searchQuery.set('');        
                         
        break;
      
      case 2: // Input
          this.carouselStandard = false;
          this.carouselSelectList = false;
          this.carouselSearchList = true;
          this.resetMarque();
          this.displaySelect = 'hidden';
        break;
      
      case 3: // List
          this.carouselStandard = false;
          this.carouselSelectList = true;
          this.carouselSearchList = false;
        break;

      case 4: // List
          this.carouselStandard = false;
          this.carouselSelectList = true;
          this.carouselSearchList = false;
          this.loadingPb = true;
          this.displayInput = 'none'; // Cache la zone de saisie
          this.displayDropdown='hidden'; // Cache la zone select
        break;
      
      default: // Standard
          this.carouselStandard = true;
          this.carouselSelectList = false;
          this.carouselSearchList = false;
          this.resetMarque();
          this.resetVetement();
          this.resetGender();   
          this.searchQuery.set('');
        break;
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

  // RECHERCHE PAR MARQUE
  submitSearchByMarques(){
  this.searchQuery.set(this.searchInputValue); // LE CAROUSEL REAGIT UNIQUEMENT LORS DU CLIC
   this.searchSubmitted.set(true);
  }

  // Click sur input
  inputClick(){
    this.manageCarousel(2);
  }

  // Réinitialise la page
  refreshList(){  
    window.location.reload();
  }

  // Dirige vers la page du Produit 
  btnView(product: string) {
    this.route.navigate(['product']);
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

  submitSearchByFilters() {
    this.applyFilters();
    this.loadingPb = false; // Arrete la progress bar
    this.resetMarque();
    this.resetVetement();
    this.resetGender();   
  }




  

}
