import { Component, output } from '@angular/core';

@Component({
  selector: 'app-hamburger',
  imports: [],
  templateUrl: './hamburger.component.html',
  styleUrl: './hamburger.component.scss',
})
export class HamburgerComponent {

    // Émet un événement au parent quand on clique
  filterClick = output<void>();

  onClick(): void {
    this.filterClick.emit();
  }

}
