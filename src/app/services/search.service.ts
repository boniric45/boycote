import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SearchService {

  // 🔥 Signaux principaux
  searchQuery = signal('');
  searchSubmitted = signal(false);
  searchFilters = signal<any | null>(null);

  // 🔥 Computed : indique si une recherche est active
  isSearching = computed(() =>
    this.searchQuery().trim().length > 0 || this.searchSubmitted()
  );

  // 🔥 Met à jour la query (appelé par Header)
  setQuery(value: string) {
    this.searchQuery.set(value);
    console.log(this.searchQuery());
    
  }

  // 🔥 Déclenche la recherche (appelé par Header)
  submit() {
    this.searchSubmitted.set(true);
  }

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
