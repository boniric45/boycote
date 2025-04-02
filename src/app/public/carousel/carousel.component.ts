import { ChangeDetectorRef,Component, AfterViewInit, ElementRef, QueryList, ViewChild, ViewChildren, input, output, signal, Input, Output, model, OnInit} from '@angular/core';
import { NgStyle } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon'
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import { Router  } from '@angular/router';
import { FacadeCollectionsService } from '../../services/facade-collections.service';



@Component({
  selector: 'app-carousel',
  imports: [NgStyle, FormsModule, MatButtonModule, MatIconModule, MatSelectModule, MatInputModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss'
})
export class CarouselComponent implements OnInit,AfterViewInit {

constructor(
  private route:Router,
  private cdRef: ChangeDetectorRef,
  private serviceFacadeCollection: FacadeCollectionsService 
){}

  ngOnInit(): void {
    this.getIdCollection(this.idCollection);
  }

  selectedIndex = 0;
  txtCollection = '';
  idCollection = 9;
  @ViewChild('carousel') carousel!:ElementRef;
  @ViewChildren('carousel__cell') cells!:QueryList<ElementRef>;
  cellWidth!:number;
  cellHeight!:number;
  isHorizontal:boolean = true;
  rotateFn = this.isHorizontal ? 'rotateY' : 'rotateX';
  radius!:number
  theta!:number;
  disabled: boolean = false;

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
  ]);

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

  getIdCollection(id:number){
    this.idCollection = id;
        this.mapCollection.forEach((value, key) => {
          if (key === id) {
            this.txtCollection = value;
            this.idCollection = key;            
             }
        });
      }

  prev()
  {
    this.timeOutButtonDisabled();
    this.idCollection--;
    this.selectedIndex--;
    if(this.idCollection === 0){      
      this.idCollection = 9;
    } 
    this.getIdCollection(this.idCollection);
    this.rotateCarousel();  
    this.timeOutButtonEnabled();
  }

  timeOutButtonDisabled(){
    setTimeout(() => {
      this.disabled = true;
    }, 0);
  }

  timeOutButtonEnabled(){
    setTimeout(() => {
      this.disabled = false;
    }, 950);
  }

  next()
  {
    this.timeOutButtonDisabled();
    this.idCollection++;
    this.selectedIndex++;
    if(this.idCollection === 10){
      this.idCollection = 1;
    } 
      this.getIdCollection(this.idCollection);
      this.rotateCarousel();   
      this.timeOutButtonEnabled();
   
  }

  initCarousel() {
    this.getIdCollection(this.idCollection);
    if (this.cellCount === 0) {
      return; // Retourner si aucune cellule n'est présente
    }
    this.theta = 360 / this.cellCount;
    const cellSize = this.isHorizontal ? this.cellWidth : this.cellHeight;
    this.radius = Math.round(cellSize / (2 * Math.tan(Math.PI / this.cellCount)));
    
    this.cells.forEach((cell: ElementRef, i: number) => {
      if (i < this.cellCount) {
        cell.nativeElement.style.opacity = 1;
        const cellAngle = this.theta * i;
        cell.nativeElement.style.transform = `${this.rotateFn}(${cellAngle}deg) translateZ(${this.radius}px)`;
      } else {
        cell.nativeElement.style.opacity = 0;
        cell.nativeElement.style.transform = 'none';
      }
    });
    this.rotateCarousel();
  }

  rotateCarousel() {
    const angle = this.selectedIndex / this.cellCount * -360;
  }
  
  ngAfterViewInit() {
    if (this.carousel) {
      this.cellWidth = this.carousel.nativeElement.offsetWidth;
      this.cellHeight = this.carousel.nativeElement.offsetHeight;
    }
    this.cdRef.detectChanges();
  }

  btnView() {
    this.serviceFacadeCollection.nameCollection = this.txtCollection;
    this.serviceFacadeCollection.idCollection = this.idCollection;
    this.route.navigate(['/product']);
    }

}




