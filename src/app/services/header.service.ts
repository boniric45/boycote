import { inject, Injectable } from '@angular/core';
import { CarouselService } from './carousel.service';
import { SearchService } from './search.service';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {

  private carouselService = inject(CarouselService);
  private searchService = inject(SearchService);

  // --- SEARCH ---
  updateSearchQuery(value: string) {
    this.searchService.searchQuery.set(value);
  }

  submitSearch() {
    this.searchService.searchSubmitted.set(true);
    this.carouselService.setMode('search');
  }

  openSearchMode() {
    this.carouselService.setMode('search');
  }

  // --- SELECT ---
  openSelectMode() {
    this.carouselService.setMode('select');
  }

  // --- PRODUCT ---
  openProductMode() {
    this.carouselService.setMode('product');
  }

  // --- STANDARD ---
  openStandardMode() {
    this.carouselService.setMode('standard');
  }

  updateSearchFilters(filters: any) {
    this.searchService.searchFilters.set(filters);
  }
}
