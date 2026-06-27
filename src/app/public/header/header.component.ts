import { CommonModule } from "@angular/common";
import { Component, EventEmitter, inject, Input, Output, signal } from "@angular/core";
import { CarouselService } from "../../services/carousel.service";
import { LogicInputService } from "../../services/logic-input.service";
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

  private logicSelectService = inject(LogicSelectService);
  private logicInputService = inject(LogicInputService);
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
    this.carouselService.setMode('standard');
    // Si déjà ouvert → reset
    if (this.searchOpen()) {
      this.resetSearch();
      window.location.reload();
      return;
    }
    // Ouvre la zone recherche
    this.searchOpen.set(true);

    if (isDesktop) {
      // Desktop 
      this.inputActive.set(true);
      this.selectActive.set(true);
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
    this.carouselService.setMode('search');
  }

  onSelectFocus() {
    this.inputActive.set(false);
    this.selectActive.set(true);
    this.carouselService.setMode('select');
  }

  resetSearch() {
    this.searchOpen.set(false);
    this.inputActive.set(true);
    this.selectActive.set(false);
  }

  onSearchInput(value: string) {
    this.logicInputService.setFilters(value);
    this.carouselService.setMode('search');
  }

  onSearchSelect(filters: any) {
    this.logicSelectService.setFilters(filters);
    this.carouselService.setMode('select');
  }

  onSearchSubmitted() {
    this.searchService.searchSubmitted.set(true);  // déclenchement
  }



}

