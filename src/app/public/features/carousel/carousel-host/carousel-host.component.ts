import { Component, computed, effect, inject, Input } from '@angular/core';
import { CarouselService } from '../../../../services/carousel.service';
import { SearchService } from '../../../../services/search.service';
import { CarouselInputComponent } from "../carousel-input/carousel-input.component";
import { CarouselProductComponent } from "../carousel-product/carousel-product.component";
import { CarouselSelectComponent } from "../carousel-select/carousel-select.component";
import { CarouselStandardComponent } from "../carousel-standard/carousel-standard.component";
import { LogicSelectService } from '../../../../services/logic-select.service';
import { Product } from '../../../../models/product';
import { ApiService } from '../../../../services/api.service';
import { LogicInputService } from '../../../../services/logic-input.service';

@Component({
  selector: 'app-carousel-host',
  imports: [CarouselStandardComponent, CarouselInputComponent, CarouselSelectComponent, CarouselProductComponent],
  templateUrl: './carousel-host.component.html',
  styleUrl: './carousel-host.component.scss',
})
export class CarouselHostComponent {

  @Input() query!: string;
  @Input() filters!: any;

  private logicSelectService = inject(LogicSelectService);
  private logicInputService = inject(LogicInputService);
  private carouselService = inject(CarouselService);
  private searchService = inject(SearchService);
  private apiService = inject(ApiService);

  // Mode du carousel
  mode = computed(() => this.carouselService.carouselMode());

  // Signaux SearchService
  // searchQuery = this.searchService.searchQuery;
  // searchSubmitted = this.searchService.searchSubmitted;
  searchQuery: string = '';
  filteredArticles: Product[] = [];

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
