import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { CarouselHomeComponent } from "../carousel-home/carousel-home.component";
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { BoycoteComponent } from "../boycote/boycote.component";
import { ProgressbarComponent } from "../progressbar/progressbar.component";


@Component({
  selector: 'app-home',
  imports: [MatButtonModule, MatDividerModule, MatIconModule, BoycoteComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  constructor(
    private route:Router,
    private productService:ProductService){}
    productHome!:Product[];

  listClick() {
    this.route.navigateByUrl("/list");    
  }


    ngOnInit(): void {
    

      
    }


}
