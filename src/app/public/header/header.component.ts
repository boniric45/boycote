import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  imports: [MatButtonModule, MatDividerModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  constructor(private route:Router){}

  compHeader() {
  this.route.navigateByUrl('header');    
  }

  listClick() {
    this.route.navigateByUrl('home');    
  }


}
