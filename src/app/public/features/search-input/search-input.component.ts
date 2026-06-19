import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-search-input',
  imports: [CommonModule],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss',
})
export class SearchInputComponent {

  @Output() searchInput = new EventEmitter<string>();
  @Output() focusInput = new EventEmitter<void>();
  @Output() reset = new EventEmitter<void>();

  /* Quand l’input prend le focus → on prévient le header */
  onFocus() {
    this.focusInput.emit();
  }

  /* Quand l’utilisateur tape → on renvoie la valeur */
  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchInput.emit(value);
  }

  onRefresh() {
    this.reset.emit();
  }

}
