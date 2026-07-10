import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CarouselService } from '../../services/carousel.service';
import { FoldermacComponent } from "../foldermac/foldermac.component";
import { HamburgerService } from '../../services/hamburger.service';
import { HeaderService } from '../../services/header.service';

@Component({
  selector: 'app-footer',
  imports: [FoldermacComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

  @Output() folderClick = new EventEmitter<string>();

  private carouselService = inject(CarouselService);
  private headerService = inject(HeaderService);

  folderCabinClick() {
    this.headerService.closeMenu();
    this.carouselService.setMode('cabin');
  }

  folderContactClick() {
    this.headerService.closeMenu();
    this.carouselService.setMode('contact');
  }

  folderNoticeClick() {
    this.headerService.closeMenu();
    this.carouselService.setMode('notice');
  }

  folderAnnulationClick() {
    this.headerService.closeMenu();
    this.carouselService.setMode('return');
  }

}

