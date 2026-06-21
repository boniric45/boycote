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

@Component({
  selector: 'app-carousel-host',
  imports: [CarouselStandardComponent, CarouselInputComponent, CarouselSelectComponent, CarouselProductComponent],
  templateUrl: './carousel-host.component.html',
  styleUrl: './carousel-host.component.scss',
})
export class CarouselHostComponent {

  private logicSelectService = inject(LogicSelectService);

  // // 🔥 Mode du carousel (standard, search, select, product…)
  // mode = computed(() => this.carouselService.carouselMode());

  // // 🔥 Signaux SearchService (pour carousel-input)
  // searchQuery = this.searchService.searchQuery;
  // searchSubmitted = this.searchService.searchSubmitted;
  // searchFilters = this.searchService.searchFilters;

  // // 🔥 Signaux SearchService (pour carousel-select)
  // searchQuerySelect = this.searchService.searchQuerySelect;
  // searchSubmittedSelect = this.searchService.searchSubmittedSelect;
  // searchFiltersSelect = this.searchService.searchFiltersSelect;

  // // 🔥 Computed : indique si une recherche est active
  // isSearching = computed(() => this.searchService.isSearching());

  @Input() query!: string;
  @Input() filters!: any;

  private carouselService = inject(CarouselService);
  private searchService = inject(SearchService);
  private apiService = inject(ApiService);

  // Mode du carousel
  mode = computed(() => this.carouselService.carouselMode());

  // Signaux SearchService
  searchQuery = this.searchService.searchQuery;
  searchSubmitted = this.searchService.searchSubmitted;
  filteredArticles: Product[] = [];

  constructor() {

    // Charger les produits UNE SEULE FOIS
    this.apiService.getProducts().subscribe(p => {
      this.logicSelectService.setArticles(p);
    });

    // Réagir au mode SELECT
    effect(() => {
      if (this.carouselService.carouselMode() === 'select') {
        this.filteredArticles = this.logicSelectService.filtered();
      }
    });
  }




  // INPUT → pipeline
  onSearch(query: string) {
    console.log('HOST → query reçue :', query);
    this.searchQuery.set(query);
    this.searchSubmitted.set(true);
    this.carouselService.setMode('search');
  }

  // SELECT → pipeline
  onSearchFilters(filters: any) {
    console.log('HOST → filters reçus :', filters);
    this.logicSelectService.setFilters(filters);   // ← MANQUAIT !
    console.log('HOST → filters reçus :', filters);
    this.carouselService.setMode('select');
  }


  ngDoCheck() {
    console.log('HOST → mode =', this.mode());
  }

}
