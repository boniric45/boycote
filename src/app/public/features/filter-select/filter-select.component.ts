import { Component, EventEmitter, Input, Output, signal } from '@angular/core';

@Component({
  selector: 'app-filter-select',
  imports: [],
  templateUrl: './filter-select.component.html',
  styleUrl: './filter-select.component.scss',
})
export class FilterSelectComponent {

  @Input() label = '';
  @Input() options: string[] = [];
  @Input() selected: string[] = [];

  @Output() toggle = new EventEmitter<string>();

  isOpen = signal(false);

  toggleOpen(event: Event) {
    event.stopPropagation();
    this.isOpen.update(v => !v);
  }

  onSelect(option: string, event: Event) {
    event.stopPropagation();
    this.toggle.emit(option);
  }


}
