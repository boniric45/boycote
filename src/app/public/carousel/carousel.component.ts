import { AfterViewInit, Component, ElementRef, input, QueryList, signal, ViewChild, ViewChildren } from '@angular/core';
import { NgStyle } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-carousel',
  imports: [NgStyle,FormsModule,MatButtonModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss'
})
export class CarouselComponent implements AfterViewInit {

  getStyle(index:number)
  {
    if (!this.cellCount)
       return null;
    const angle=(index-this.selectedIndex)*2*Math.PI/this.cellCount
    const scale=((75)+25*Math.cos(angle))/100

    return {
      left:-75+150*Math.sin(angle)+'px',
      transform:'scale('+scale+')',
      position:'absolute',
      "z-index":Math.floor(100*scale)
    }
  }

  get cellCount()
  {
    return this.cells?this.cells.length:0;
  }
  selectedIndex = 0;
  @ViewChild('carousel') carousel!:ElementRef
  @ViewChildren('carousel__cell') cells!:QueryList<ElementRef>
  cellWidth!:number;
  cellHeight!:number;
  isHorizontal:boolean = true;

  rotateFn = this.isHorizontal ? 'rotateY' : 'rotateX';
  radius!:number
  theta!:number;
  // console.log( cellWidth, cellHeight );

  prev()
  {
    this.selectedIndex--;
    this.rotateCarousel();
  }
  next()
  {
    this.selectedIndex++;
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
