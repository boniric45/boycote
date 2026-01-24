import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CarouselComponent } from "./public/carousel/carousel.component";
import { HomeComponent } from "./public/home/home.component";
import { ConstructionComponent } from "./public/construction/construction.component";


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  
}
