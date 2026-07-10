import { Component, inject } from '@angular/core';
import { CarouselService } from '../../services/carousel.service';

@Component({
  selector: 'app-button-return',
  imports: [],
  templateUrl: './button-return.component.html',
  styleUrl: './button-return.component.scss',
})
export class ButtonReturnComponent {

  private carouselService = inject(CarouselService);
  
  isClicked = false;

  handleClick() {
    this.isClicked = true;

    // Animation / état visuel
    setTimeout(() => {
      this.carouselService.setMode('standard');
    }, 0);

    setTimeout(() => {
      this.isClicked = false;
    }, 300);
  }

}
