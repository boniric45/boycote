import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output, signal } from "@angular/core";
import { CartComponent } from "../cart/cart.component";
import { HamburgerComponent } from "../features/hamburger/hamburger.component";
import { SearchInputComponent } from "../features/search-input/search-input.component";
import { SearchSelectsComponent } from "../features/search-selects/search-selects.component";
import { SearchRefreshComponent } from "../features/search-refresh/search-refresh.component";


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, HamburgerComponent, CartComponent, SearchInputComponent, SearchSelectsComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  /* Données venant du parent */
  @Input() marques: string[] = [];
  @Input() types: string[] = [];
  @Input() genders: string[] = [];

  /* Events renvoyés au parent */
  @Output() searchInput = new EventEmitter<string>();
  @Output() searchFilters = new EventEmitter<any>();
  @Output() refresh = new EventEmitter<void>();

  /* États du header */
  searchOpen = signal(false);     // Mode recherche activé
  inputActive = signal(true);    // Input visible
  selectActive = signal(false);   // Selects visibles


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

  if (isDesktop) {

    // Si la recherche est déjà ouverte → on ferme tout
    if (this.searchOpen()) {
      this.searchOpen.set(false);
      this.inputActive.set(false);
      this.selectActive.set(false);
      return;
    }

    // Sinon → on ouvre tout
    this.searchOpen.set(true);
    this.inputActive.set(true);
    this.selectActive.set(true);

  } else {

    // MOBILE : comportement normal
    this.openSearch();
  }
}





  /* ============================
     2) INPUT PREND LE FOCUS
     ============================ */
  onInputFocus() {
    this.inputActive.set(true);
    this.selectActive.set(false);
  }

  /* ============================
     3) SELECT PREND LE FOCUS
     ============================ */
  onSelectFocus() {
    this.inputActive.set(false);
    this.selectActive.set(true);
  }

  /* ============================
     4) INPUT → envoi au parent
     ============================ */
  onSearchInput(value: string) {
    this.searchInput.emit(value);
  }

  /* ============================
     5) SELECT → envoi au parent
     ============================ */
  onSearchFilters(filters: any) {
    this.searchFilters.emit(filters);
  }

  /* ============================
     6) BOUTON REFRESH → RESET TOTAL
     ============================ */
  resetSearch() {
    this.searchOpen.set(false);
    this.inputActive.set(false);
    this.selectActive.set(false);
    this.refresh.emit();
  }




}

