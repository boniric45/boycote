import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from "./public/home/home.component";
import { ListOfCollectionsComponent } from "./public/list-of-collections/list-of-collections.component";
import { HeaderComponent } from "./public/header/header.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HomeComponent, ListOfCollectionsComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'boycote';
}
