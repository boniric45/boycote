import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import { Router } from '@angular/router';
import { HomeComponent } from "../home/home.component";

@Component({
  selector: 'app-header',
  imports: [MatButtonModule, MatDividerModule, MatIconModule, HomeComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  routeActive: string | undefined;

  constructor(private route:Router){}

  listClick() {
    this.routeActive = "/home";

    console.log('zobi');
    
  }


}
