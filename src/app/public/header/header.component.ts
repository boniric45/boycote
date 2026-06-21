import { CommonModule } from "@angular/common";
import { Component, inject, Input, signal } from "@angular/core";
import { HeaderService } from "../../services/header.service";
import { CartComponent } from "../cart/cart.component";
import { HamburgerComponent } from "../features/hamburger/hamburger.component";
import { SearchInputComponent } from "../features/search-input/search-input.component";
import { SearchSelectsComponent } from "../features/search-selects/search-selects.component";
import { CarouselInputComponent } from "../features/carousel/carousel-input/carousel-input.component";


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    HamburgerComponent,
    CartComponent,
    SearchInputComponent,
    SearchSelectsComponent,
    CarouselInputComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {

  private headerService = inject(HeaderService);

  /* Données venant du parent */
  @Input() marques: string[] = [];
  @Input() types: string[] = [];
  @Input() genders: string[] = [];

  /* États du header */
  searchOpen = signal(false);     // Mode recherche activé
  inputActive = signal(true);     // Input visible
  selectActive = signal(false);   // Selects visibles
  productActive = signal(false);  // Carousel Product visible
  searchQuery = signal('');
  searchSubmitted = signal(false);




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
    const isDesktop = this.isDesktop();

    if (isDesktop) {
      if (this.searchOpen()) {
        this.closeAll();
        this.headerService.openStandardMode();
        return;
      }

      this.openAll();
      this.headerService.openSearchMode();
    } else {
      this.openAll();
      this.headerService.openSearchMode();
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

  /* ============================
     2) INPUT PREND LE FOCUS
     ============================ */
  onInputFocus() {
    this.inputActive.set(true);
    this.selectActive.set(false);
    this.headerService.openSearchMode();
  }

  /* ============================
     3) SELECT PREND LE FOCUS
     ============================ */
  onSelectFocus() {
    this.inputActive.set(false);
    this.selectActive.set(true);
    this.headerService.openSelectMode();
  }

  /* ============================
     4) INPUT → SearchService
     ============================ */
  onSearchInput(value: string) {
    console.log("HEADER REÇOIT :", value);
    this.searchQuery.set(value);
  }

  /* ============================
     5) SELECT → SearchService
     ============================ */
  onSearchFilters(filters: any) {
    this.headerService.updateSearchFilters(filters);
    this.headerService.openSelectMode();
  }


  /* ============================
     6) BOUTON REFRESH
     ============================ */
  resetSearch() {
    this.closeAll();
    this.headerService.openStandardMode();
  }

  onSearchSubmitted() {
    this.searchSubmitted.set(true);
  }



}

