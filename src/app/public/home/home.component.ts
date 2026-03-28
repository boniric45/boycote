import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { BoycoteComponent } from '../features/boycote/boycote.component';


@Component({
  selector: 'app-home',
  imports: [MatButtonModule, MatDividerModule, MatIconModule, BoycoteComponent ],
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
