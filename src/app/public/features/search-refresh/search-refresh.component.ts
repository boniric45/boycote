import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-search-refresh',
  imports: [],
  templateUrl: './search-refresh.component.html',
  styleUrl: './search-refresh.component.scss',
})
export class SearchRefreshComponent {

    @Output() reset = new EventEmitter<void>();

  onClick() {
    this.reset.emit();
  }

}
