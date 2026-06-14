import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { StopLandscapeComponent } from "./public/features/stop-landscape/stop-landscape.component";
import { CartComponent } from "./public/cart/cart.component";


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, StopLandscapeComponent, CartComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  
}
