import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-of-collections',
  imports: [],
  templateUrl: './list-of-collections.component.html',
  styleUrl: './list-of-collections.component.scss'
})
export class ListOfCollectionsComponent implements OnInit,OnDestroy{

  currentIndex = 0;

  images = [
    '/pictures/1.jpg',
    '/pictures/2.jpg', 
    '/pictures/3.jpg',
    '/pictures/4.jpg',
  ];




  private intervalId: any; // Pour garder la référence de l'intervalle

  ngOnInit() {
    // start the carousel 
   // this.startAutoSlide();
  }

  ngOnDestroy() {
    // stop interval this component is destroy
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  nextImage() {
    if (this.currentIndex < this.images.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
  }

  previousImage() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.images.length - 1;
    }
  }

  startAutoSlide() {
    this.intervalId = setInterval(() => {
      this.nextImage();
    }, 5000); // 5000 ms = 5 seconds
  }



}
