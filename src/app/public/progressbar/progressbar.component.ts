import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-progressbar',
  imports: [MatProgressSpinnerModule,CommonModule],
  templateUrl: './progressbar.component.html',
  styleUrl: './progressbar.component.scss',
})
export class ProgressbarComponent {

  @Input() isLoading = false;


}
