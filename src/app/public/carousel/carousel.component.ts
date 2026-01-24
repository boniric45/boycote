import { ChangeDetectorRef,Component, AfterViewInit, ElementRef, QueryList, ViewChild, ViewChildren, OnInit, inject, viewChildren} from '@angular/core';
import { CommonModule, NgStyle } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon'
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import { Router  } from '@angular/router';
import { ComponentRightComponent } from '../component-right/component-right.component';
import { ComponentLeftComponent } from "../component-left/component-left.component";
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';

@Component({
  selector: 'app-carousel',
  imports: [NgStyle, FormsModule, MatButtonModule, MatIconModule, MatSelectModule, MatInputModule, ComponentRightComponent, ComponentLeftComponent,CommonModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss'
})
export class CarouselComponent implements AfterViewInit {

constructor(
  private route:Router,
  private cdRef: ChangeDetectorRef,
  ){}

  private productService = inject(ProductService);
  @ViewChild('carousel') carousel!:ElementRef;
  @ViewChildren('carousel__cell') cells!:QueryList<ElementRef>; // Alimente le carousel avec les infos du dom
  product:Product | undefined;
  products:Product[] = [];
  nameProduct = "";
  marqueProduct = "";
  selectedIndexImage: number = 0;
  cellWidth!:number;
  cellHeight!:number;
  isHorizontal:boolean = true;
  rotateFn = this.isHorizontal ? 'rotateY' : 'rotateX';
  radius!:number;
  theta!:number;
  disabled: boolean = false;
  numberProduct:number = 0;

  // Gère le style du Carousel
  getStyle(index:number)
  {   
    if (!this.cellCount)
       return null;
      const angle = (index-this.selectedIndexImage)*2*Math.PI/this.cellCount; // mettre 3 pour le carousel mobile
      const scale = ((75)+5*Math.cos(angle))/110;
      return {
      left:-30+250*Math.sin(angle)+'px', // 150 de base
      transform:'scale('+scale+')',
      position:'absolute',
      "z-index":Math.floor(100*scale)
    }
  }

  get cellCount()
  {   
    return this.cells? this.cells.length:0;
  }

  readViewProduct(){
    this.products.forEach(p => 
    {
      if(this.selectedIndexImage === p.idImage){
        console.log('id > '+this.selectedIndexImage+' Name : '+p.name);
        this.nameProduct = p.name;
        this.marqueProduct = p.marque;
      }
    });
  }

  // Gère les boutons
  startCarousel(char:string):void{   
    if(char == 'left'){
      this.prev();
    } else if(char == 'right'){
      this.next();
    }
  }
    // Gère le bouton suivant
  next()
  {
    this.timeOutButtonDisabled();
    this.selectedIndexImage++;
    this.readViewProduct();
    // this.rotateCarousel();   
    this.timeOutButtonEnabled();
  }

  // Gère le bouton avant
  prev()
  {
    this.timeOutButtonDisabled();
    this.selectedIndexImage--;
    this.readViewProduct();
   // this.rotateCarousel();  
    this.timeOutButtonEnabled();
  }
  // Désactive le bouton après click
  timeOutButtonDisabled(){
    setTimeout(() => {
      this.disabled = true;
    }, 0);
  }
  // Réactive le bouton après 1 Seconde 
  timeOutButtonEnabled(){
    setTimeout(() => {
      this.disabled = false;
    }, 950);
  }

  // Récupère une quantité limitée de produits en fonction du nombre choisi 
  getListProducts(nb:number){
      this.productService.getProducts().subscribe((p)=>{
       p.forEach(el => 
        {
        if(el.idImage <= nb) 
          {
          this.products.push(el);
          if(el.idImage == 10){
            this.nameProduct = el.name;
            this.marqueProduct = el.marque;
          }
          }
        });           
    });
  }

  // Initialise le carousel
  // initCarousel() {
  //    if (this.cellCount === 0) {
  //     return; // Retourner si aucune cellule n'est présente
  //   } 

  //   this.theta = 360 / this.cellCount;
  //   const cellSize = this.isHorizontal ? this.cellWidth : this.cellHeight;
  //   this.radius = Math.round(cellSize / (2 * Math.tan(Math.PI / this.cellCount)));
    
  //   this.cells.forEach((cell: ElementRef, i: number) => {
  //     if (i < this.cellCount) {
  //       cell.nativeElement.style.opacity = 1;
  //       const cellAngle = this.theta * i;
  //       cell.nativeElement.style.transform = `${this.rotateFn}(${cellAngle}deg) translateZ(${this.radius}px)`;
  //     } else {
  //       cell.nativeElement.style.opacity = 0;
  //       cell.nativeElement.style.transform = 'none';
  //     }
  //   });
  //  this.rotateCarousel();
  // }



  // Fait tourner le carousel
  // rotateCarousel() {
  // this.selectedIndexImage / this.cellCount * -360;
  // }
  
  ngAfterViewInit() {

    this.getListProducts(10); // 7 pour avoir le carousel de cinq
    

    if (this.carousel) {
      this.cellWidth = this.carousel.nativeElement.offsetWidth;
      this.cellHeight = this.carousel.nativeElement.offsetHeight;
    }
  
   this.cdRef.detectChanges();
  }

  // Dirige vers la page du Produit 
  btnView(product:string) {   
    // this.serviceFacadeCollection.nameCollection = product;
    // this.serviceFacadeCollection.idCollection = this.idCollection;
    this.route.navigate(['product']);
    }
    




}




