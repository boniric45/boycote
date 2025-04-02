import { Component,OnInit } from '@angular/core';
import { FacadeCollectionsService } from '../../services/facade-collections.service';


@Component({
  selector: 'app-product',
  imports: [],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent implements OnInit{
constructor(private serviceFacadeCollection: FacadeCollectionsService){}

  nameCollection = '';
  idCollection = 0;

ngOnInit(): void {
  this.initProduct();
}

initProduct(){
  this.nameCollection = this.serviceFacadeCollection.nameCollection;
  this.idCollection = this.serviceFacadeCollection.idCollection;  
}


  





}
