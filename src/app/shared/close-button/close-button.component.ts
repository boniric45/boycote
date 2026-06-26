import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-close-button',
  imports: [],
  templateUrl: './close-button.component.html',
  styleUrl: './close-button.component.scss',
})
export class CloseButtonComponent {

  @Output() close = new EventEmitter<void>();

  onClick() {
    this.close.emit();
  }

}
