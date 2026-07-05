import { Component, inject } from '@angular/core';
import { CarouselService } from '../../services/carousel.service';

@Component({
  selector: 'app-cancel',
  imports: [],
  templateUrl: './cancel.component.html',
  styleUrl: './cancel.component.scss',
})
export class CancelComponent {

    private carouselService = inject(CarouselService);

  goToHome() {
    this.carouselService.setMode('standard');
    window.location.href = '/';
  }

}
