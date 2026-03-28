import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output} from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-out-of-stock-modal',
  imports: [CommonModule,FormsModule],
  templateUrl: './out-of-stock-modal.component.html',
  styleUrl: './out-of-stock-modal.component.scss',
})
export class OutOfStockModalComponent {

  email = '';

  @Output() close = new EventEmitter<void>();
  @Output() submitEmail = new EventEmitter<string>();

  onSubmit() {
    this.submitEmail.emit(this.email);
  }

}
