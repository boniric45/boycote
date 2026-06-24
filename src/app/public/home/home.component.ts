import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';


@Component({
  selector: 'app-home',
  imports: [MatButtonModule, MatDividerModule, MatIconModule ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(
    private route:Router,
    private productService:ProductService){}
    productHome!:Product[];

  listClick() {
    //this.route.navigateByUrl("/list");    
  }

}
