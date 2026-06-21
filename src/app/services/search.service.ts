import { computed, Injectable, signal } from '@angular/core';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class SearchService {


  // 🔥 Signaux Input
  searchQuery = signal('');
  searchSubmitted = signal(false);
  searchFilters = signal<any | null>(null);

  // 🔥 Signaux Select
  searchFiltersSelect = signal<any>(null);
  selectSubmitted = signal(false);
  filteredArticlesSelect = signal<Product[]>([]);


  // 🔥 Computed : indique si une recherche est active
  isSearching = computed(() =>
    this.searchQuery().trim().length > 0 || this.searchSubmitted()
  );

  // 🔥 Met à jour la query (appelé par Header)
  setQuery(value: string) {
    this.searchQuery.set(value);
  }

  // 🔥 Déclenche la recherche (appelé par Header)
  submit() {
    this.searchSubmitted.set(true);
  }

  // submitSelect() {
  //   this.searchSubmittedSelect.set(true);
  // }

  // 🔥 Réinitialise la recherche (appelé quand on efface)
  reset() {
    this.searchQuery.set('');
    this.searchSubmitted.set(false);
    this.searchFilters.set(null);
  }

  // 🔥 Met à jour les filtres (carousel-input)
  setFilters(filters: any) {
    this.searchFilters.set(filters);
  }



}
