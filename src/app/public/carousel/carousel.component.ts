import { AfterViewInit, Component, ElementRef, EventEmitter, Input, input, model, OnInit, Output, QueryList, signal, ViewChild, ViewChildren } from '@angular/core';
import { NgStyle } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon'
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';

@Component({
  selector: 'app-carousel',
  imports: [NgStyle, FormsModule, MatButtonModule, MatIconModule, MatSelectModule, MatInputModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss'
})
export class CarouselComponent implements AfterViewInit {
  idcollection = 0;
  selectedIndex = 0;
  nameCollection = 0;
  txtCollection = '';
  @ViewChild('carousel') carousel!:ElementRef;
  @ViewChildren('carousel__cell') cells!:QueryList<ElementRef>;
  cellWidth!:number;
  cellHeight!:number;
  isHorizontal:boolean = true;
  rotateFn = this.isHorizontal ? 'rotateY' : 'rotateX';
  radius!:number
  theta!:number;

  collections = [1,2,3,4,5,6,7,8,9];

  mapCollection = new Map<number,string>([
    [1,"Collection 1"],
    [2,"Collection 2"],
    [3,"Collection 3"],
    [4,"Collection 4"],
    [5,"Collection 5"],
    [6,"Collection 6"],
    [7,"Collection 7"],
    [8,"Collection 8"],
    [9,"Collection 9"]
  ]


  );
idCollection: any;



  getStyle(index:number)
  {   
  
    if (!this.cellCount)
       return null;
    const angle=(index-this.selectedIndex)*2*Math.PI/this.cellCount
    const scale=((75)+5*Math.cos(angle))/110

    return {
      left:-30+150*Math.sin(angle)+'px',
      transform:'scale('+scale+')',
      position:'absolute',
      "z-index":Math.floor(100*scale)
    }
  }

  get cellCount()
  {
    return this.cells?this.cells.length:0;
  }


  // get name of map with index
  getNameCollections(){

    
  this.collections.forEach((c)=>{
    this.idCollection = c;

    if(c === this.selectedIndex){
      this.nameCollection = c;
      this.mapCollection.forEach((keys,value) => {
        if(value == this.selectedIndex){
          console.log(this.idCollection);
          this.txtCollection = keys;
        }
      })
    }
  });
  }


  prev()
  {
    this.selectedIndex--;
    this.getNameCollections();
    this.rotateCarousel();  
  }

  next()
  {
    this.selectedIndex++;
    this.getNameCollections();
    this.rotateCarousel();   

  }

  initCarousel() {
    this.theta = 360 / this.cellCount;
    const cellSize = this.isHorizontal ? this.cellWidth : this.cellHeight;
    this.radius = Math.round( ( cellSize / 2) / Math.tan( Math.PI / this.cellCount ) );
    this.cells.forEach((cell:ElementRef,i:number)=>
    {
       if (i<this.cellCount)
       {
           cell.nativeElement.style.opacity=1
           const cellAngle=this.theta*i;
           cell.nativeElement.style.transform = this.rotateFn + '(' + cellAngle + 'deg) translateZ(' + this.radius + 'px)';
       }
       else
       {
        cell.nativeElement.style.opacity = 0;
        cell.nativeElement.style.transform = 'none';
       }
    })
    this.rotateCarousel();
  }

  orientationChange()
  {
    this.rotateFn = this.isHorizontal ? 'rotateY' : 'rotateX';
    this.initCarousel()
  }

  rotateCarousel() {
    const angle = this.selectedIndex / this.cellCount * -360;
    this.carousel.nativeElement.style.transform = 'translateZ(-288px)'+this.rotateFn+'(' + angle + 'deg)';
  }
  
  ngAfterViewInit()
  {
    this.cellWidth = this.carousel.nativeElement.offsetWidth;
    this.cellHeight = this.carousel.nativeElement.offsetHeight;
    this.initCarousel()
  }


  

}
