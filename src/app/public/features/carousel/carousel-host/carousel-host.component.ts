import { Component, computed, effect, inject, Input } from '@angular/core';
import { Product } from '../../../../models/product';
import { CarouselService } from '../../../../services/carousel.service';
import { LogicInputService } from '../../../../services/logic-input.service';
import { LogicSelectService } from '../../../../services/logic-select.service';
import { CabineComponent } from "../../../cabine/cabine.component";
import { CarouselInputComponent } from "../carousel-input/carousel-input.component";
import { CarouselProductComponent } from "../carousel-product/carousel-product.component";
import { CarouselSelectComponent } from "../carousel-select/carousel-select.component";
import { CarouselStandardComponent } from "../carousel-standard/carousel-standard.component";
import { ContactComponent } from "../../contact/contact.component";

@Component({
  selector: 'app-carousel-host',
  imports: [CarouselStandardComponent, CarouselInputComponent, CarouselSelectComponent, CarouselProductComponent, CabineComponent, ContactComponent],
  templateUrl: './carousel-host.component.html',
  styleUrl: './carousel-host.component.scss',
})
export class CarouselHostComponent {

  @Input() query!: string;
  @Input() filters!: any;

  private logicSelectService = inject(LogicSelectService);
  private logicInputService = inject(LogicInputService);
  private carouselService = inject(CarouselService);

  // Mode du carousel
  mode = computed(() => this.carouselService.carouselMode());

  searchQuery: string = '';
  filteredArticles: Product[] = [];
  idProduct: number = 0;
  
  constructor() {

    // Réagir au mode SELECT
    effect(() => {
      if (this.carouselService.carouselMode() === 'select') {
        this.filteredArticles = this.logicSelectService.filtered();
      }
    });

    effect(() => {
      if (this.carouselService.carouselMode() === 'search') {
        this.filteredArticles = this.logicInputService.filtered();
      }
    });
  }

  // INPUT → pipeline
  onSearch(query: string) {
    this.logicInputService.setFilters(query);
    this.carouselService.setMode('search');
  }

  // SELECT → pipeline
  onSearchFilters(filters: any) {
    this.logicSelectService.setFilters(filters); 
    this.carouselService.setMode('select');
  }


}
