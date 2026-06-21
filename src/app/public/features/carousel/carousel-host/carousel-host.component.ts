import { Component, computed, inject } from '@angular/core';
import { CarouselService } from '../../../../services/carousel.service';
import { CarouselStandardComponent } from "../carousel-standard/carousel-standard.component";
import { CarouselInputComponent } from "../carousel-input/carousel-input.component";
import { CarouselSelectComponent } from "../carousel-select/carousel-select.component";
import { CarouselProductComponent } from "../carousel-product/carousel-product.component";
import { SearchService } from '../../../../services/search.service';

@Component({
  selector: 'app-carousel-host',
  imports: [CarouselStandardComponent, CarouselInputComponent, CarouselSelectComponent, CarouselProductComponent],
  templateUrl: './carousel-host.component.html',
  styleUrl: './carousel-host.component.scss',
})
export class CarouselHostComponent {

  private carouselService = inject(CarouselService);
  private searchService = inject(SearchService);
  
  // 🔥 Mode du carousel (standard, search, select, product…)
  mode = computed(() => this.carouselService.carouselMode());
  
  // 🔥 Signaux SearchService (pour carousel-input)
  searchQuery = this.searchService.searchQuery;
  searchSubmitted = this.searchService.searchSubmitted;
  searchFilters = this.searchService.searchFilters;

  // 🔥 Computed : indique si une recherche est active
  isSearching = computed(() => this.searchService.isSearching());
}
