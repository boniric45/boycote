import { Component, EventEmitter, inject, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CarouselService } from '../../../services/carousel.service';


@Component({
  selector: 'app-construction',
  imports: [RouterModule],
  templateUrl: './construction.component.html',
  styleUrl: './construction.component.scss'
})
export class ConstructionComponent {

  @Output() exit = new EventEmitter<void>();

  onEnterSite() {
    this.exit.emit();
  }

}
