import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CarouselService } from '../../services/carousel.service';
import { FoldermacComponent } from "../foldermac/foldermac.component";

@Component({
  selector: 'app-footer',
  imports: [FoldermacComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

  @Output() folderClick = new EventEmitter<string>();

  private carouselService = inject(CarouselService);

  folderCabinClick() {
    this.carouselService.setMode('cabin');
  }

  folderContactClick() {
    this.carouselService.setMode('contact');
  }

  folderNoticeClick() {
    this.carouselService.setMode('notice');
  }

  folderAnnulationClick() {
    this.carouselService.setMode('return');
  }

}

