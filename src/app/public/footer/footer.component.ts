import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { FoldermacComponent } from "../foldermac/foldermac.component";
import { RouterLink } from "@angular/router";
import { CabineComponent } from "../cabine/cabine.component";
import { CarouselService } from '../../services/carousel.service';

@Component({
  selector: 'app-footer',
  imports: [FoldermacComponent, RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

  @Output() folderClick = new EventEmitter<string>();

  private carouselService = inject(CarouselService);
  
  folderCabinClick(){
    this.carouselService.setMode('cabin');
  }

  folderContactClick(){
    this.carouselService.setMode('contact');
  }
  
  // onClick(route: string = 'contact') {
  //   this.folderClick.emit(route);
  // }



}

