import { Component, inject } from '@angular/core';
import { CarouselService } from '../../../services/carousel.service';

@Component({
  selector: 'app-contact',
  imports: [],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  email = 'contact@boycoté.fr';
  instagram = '@boycotearchive';

  private carouselService = inject(CarouselService);


  closeCart() {
      this.carouselService.setMode('standard');
  }

}
