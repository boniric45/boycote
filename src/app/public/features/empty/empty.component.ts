import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CarouselService } from '../../../services/carousel.service';

@Component({
  selector: 'app-empty',
  imports: [],
  templateUrl: './empty.component.html',
  styleUrl: './empty.component.scss',
})
export class EmptyComponent {

  // // Sert de routes pour garder la navigation dans le carousel, mais ne sert à rien d'autre. Il n'y a pas de contenu à afficher pour cette route.
  // constructor(private route: ActivatedRoute, private carousel: CarouselService) {

  //   this.route.params.subscribe(p => {

  //     this.carousel.navigate(p['mode'] as CarouselMode);

  //   });
  // }


}
