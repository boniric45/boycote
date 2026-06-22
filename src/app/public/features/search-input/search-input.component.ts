import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, inject, Input, Output, signal, ViewChild } from '@angular/core';
import { SearchService } from '../../../services/search.service';

@Component({
  selector: 'app-search-input',
  imports: [CommonModule],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss',
})
export class SearchInputComponent {

  private searchService = inject(SearchService);
  @Output() focusInput = new EventEmitter<void>();
  @Output() searchInput = new EventEmitter<string>();
  @Output() reset = new EventEmitter<void>();
  @Input() selectActive = false;
  @Input() inputActive = false;

  @ViewChild('searchInputRef') searchInputRef!: ElementRef<HTMLInputElement>;

  inputValue = '';

  /* Quand l’input prend le focus → on prévient le header */
  onFocus() {
    this.focusInput.emit();
    this.searchService.searchSubmitted.set(false);
    // Reinitialise le champ pour une autre recherche
    this.inputValue = '';
    this.searchInputRef.nativeElement.value = ''
  }

  /* Quand l’utilisateur tape → on renvoie la valeur */
  onInput(event: Event) {
    this.inputValue = (event.target as HTMLInputElement).value;
  }

  onSearchClick() {
    this.searchInput.emit(this.inputValue); // envoie la valeur
    // this.submitted.emit();                  // débloque la progressbar
  }

    /* ============================
     6) BOUTON REFRESH → RESET TOTAL
     ============================ */
  onRefresh() {
    this.reset.emit();
  }

}
