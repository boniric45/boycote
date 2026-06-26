import { Component, inject } from '@angular/core';
import { CloseButtonComponent } from "../../../shared/close-button/close-button.component";
import { CarouselService } from '../../../services/carousel.service';

@Component({
  selector: 'app-contact',
  imports: [CloseButtonComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  email = 'contact@boycoté.fr';
  instagram = '@toncompte';

  private carouselService = inject(CarouselService);


  closeCart() {
    this.carouselService.setMode('standard');
  }

}
