import { Component, inject } from '@angular/core';
import { CarouselService } from '../../services/carousel.service';
import { ButtonReturnComponent } from "../../shared/button-return/button-return.component";

@Component({
  selector: 'app-cancel',
  imports: [ButtonReturnComponent],
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
