import { CommonModule } from "@angular/common";
import { Component, EventEmitter, inject, Input, Output, signal } from "@angular/core";
import { CarouselService } from "../../services/carousel.service";
import { HeaderService } from "../../services/header.service";
import { LogicSelectService } from "../../services/logic-select.service";
import { SearchService } from "../../services/search.service";
import { CartComponent } from "../cart/cart.component";
import { HamburgerComponent } from "../features/hamburger/hamburger.component";
import { SearchInputComponent } from "../features/search-input/search-input.component";
import { SearchSelectsComponent } from "../features/search-selects/search-selects.component";


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    HamburgerComponent,
    CartComponent,
    SearchInputComponent,
    SearchSelectsComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {

  private headerService = inject(HeaderService);
  private logicSelectService = inject(LogicSelectService);
  private searchService = inject(SearchService);
  private carouselService = inject(CarouselService);

  /* Données venant du parent */
  @Input() marques: string[] = [];
  @Input() types: string[] = [];
  @Input() genders: string[] = [];

  @Output() searchFilters = new EventEmitter<any>();
  @Output() search = new EventEmitter<string>();

  /* États du header */
  searchOpen = signal(false);     // Mode recherche activé
  inputActive = signal(true);     // Input visible
  selectActive = signal(false);   // Selects visibles
  productActive = signal(false);  // Carousel Product visible
  // searchQuery = signal('');
  // searchQuerySelect = signal('');
  // searchSubmittedSelect = signal(false);
  // searchSubmitted = signal(false);
  // filtersSubmitted = signal(false);


  /* ============================
   0- RESOLUTION DESKTOP
   ============================ */
  isDesktop(): boolean {
    return window.innerWidth >= 900;
  }

  /* ============================
  1) CLIC SUR LE HAMBURGER
  ============================ */
  openSearch() {
    this.searchOpen.set(true);
    this.inputActive.set(true);
    this.selectActive.set(true);
  }

  onHamburgerClick() {
    const isDesktop = window.innerWidth >= 900;

    // Si déjà ouvert → reset
    if (this.searchOpen()) {
      this.resetSearch();
      return;
    }

    // Ouvre la zone recherche
    this.searchOpen.set(true);

    if (isDesktop) {
      // Desktop → input seul
      this.inputActive.set(true);
      this.selectActive.set(false);
    } else {
      // Mobile → input + selects ensemble
      this.inputActive.set(true);
      this.selectActive.set(true);
    }
  }


  openAll() {
    this.searchOpen.set(true);
    this.inputActive.set(true);
    this.selectActive.set(true);
  }

  closeAll() {
    this.searchOpen.set(false);
    this.inputActive.set(false);
    this.selectActive.set(false);
  }

  onInputFocus() {
    this.inputActive.set(true);
    this.selectActive.set(false);
  }

  onSelectFocus() {
    this.inputActive.set(false);
    this.selectActive.set(true);
  }

  onSearchInput(value: string) {
    this.search.emit(value);   // 🔥 RELAYE AU HOST
  }

  resetSearch() {
    this.searchOpen.set(false);
    this.inputActive.set(true);
    this.selectActive.set(false);
  }

  onSearchSelect(filters: any) {
    console.log(filters);
    this.logicSelectService.setFilters(filters);
    this.carouselService.setMode('select');
  }

  onSearchSubmitted() {
    this.searchService.searchSubmitted.set(true);  // déclenchement
  }



}

