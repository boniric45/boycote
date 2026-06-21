import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { forkJoin, Subscription } from 'rxjs';
import { Garment } from '../../../models/garment';
import { Gender } from '../../../models/gender';
import { Marque } from '../../../models/marque';
import { GarmentService } from '../../../services/garment.service';
import { GenderService } from '../../../services/gender.service';
import { MarqueService } from '../../../services/marque.service';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-search-selects',
  imports: [CommonModule],
  templateUrl: './search-selects.component.html',
  styleUrl: './search-selects.component.scss',
})
export class SearchSelectsComponent {

  @Output() focusSelect = new EventEmitter<void>();
  @Output() searchFilters = new EventEmitter<any>();
  @Output() reset = new EventEmitter<void>();
  @Input() selectActive = false;
  @Input() inputActive = false;



  private apiService = inject(ApiService);
  private genderService = inject(GenderService);
  private typeService = inject(GarmentService);

  marques: Marque[] = [];
  genders: Gender[] = [];
  types: Garment[] = [];
  subscription = new Subscription();

  openMarques = signal(false);
  openTypes = signal(false);
  openGenders = signal(false);

  selectedMarques = signal<string[]>([]);
  selectedTypes = signal<string[]>([]);
  selectedGenders = signal<string[]>([]);




  /* ============================
        CHARGEMENT API
     ============================ */
  ngOnInit(): void {
    this.subscription.add(
      forkJoin({
        marques: this.apiService.getMarques(),
        genders: this.genderService.getAll(),
        types: this.typeService.getAll()
      }).subscribe(result => {
        this.marques = result.marques;
        this.genders = result.genders;
        this.types = result.types;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /* ============================
        FOCUS
     ============================ */
  onFocus() {
    this.focusSelect.emit();
  }

  /* ============================
        DROPDOWNS
     ============================ */
  toggleMarquesDropdown(event: Event) {
    event.stopPropagation();
    this.openMarques.set(!this.openMarques());
    this.focusSelect.emit();
  }

  toggleTypesDropdown(event: Event) {
    event.stopPropagation();
    this.openTypes.set(!this.openTypes());
    this.focusSelect.emit();

  }

  toggleGendersDropdown(event: Event) {
    event.stopPropagation();
    this.openGenders.set(!this.openGenders());
    this.focusSelect.emit();

  }

  isOpenMarques() { return this.openMarques(); }
  isOpenTypes() { return this.openTypes(); }
  isOpenGenders() { return this.openGenders(); }

  /* ============================
        TOGGLES DES OPTIONS
     ============================ */
  toggleMarque(name: string, event: Event) {
    event.stopPropagation();
    const arr = this.selectedMarques();
    this.selectedMarques.set(
      arr.includes(name)
        ? arr.filter(x => x !== name)
        : [...arr, name]
    );
  }

  toggleType(name: string, event: Event) {
    event.stopPropagation();
    const arr = this.selectedTypes();
    this.selectedTypes.set(
      arr.includes(name) ? arr.filter(x => x !== name) : [...arr, name]
    );
  }

  toggleGender(name: string, event: Event) {
    event.stopPropagation();
    const arr = this.selectedGenders();
    this.selectedGenders.set(
      arr.includes(name) ? arr.filter(x => x !== name) : [...arr, name]
    );
  }

  /* ============================
        LABELS DES SELECTS
     ============================ */
  labMarques() {
    const arr = this.selectedMarques();
    return arr.length ? arr.join(', ') : 'BRANDS';
  }

  labTypes() {
    const arr = this.selectedTypes();
    return arr.length ? arr.join(', ') : 'GARMENTS';
  }

  labGenders() {
    const arr = this.selectedGenders();
    return arr.length ? arr.join(', ') : 'GENDERS';
  }

  /* ============================
        VALIDATION
     ============================ */
  submitSearchByFilters() {
    this.searchFilters.emit({
      marques: this.selectedMarques(),
      types: this.selectedTypes(),
      genders: this.selectedGenders()
    });    
  }

  /* ============================
     6) BOUTON REFRESH → RESET TOTAL
     ============================ */
  onRefresh() {
    this.reset.emit();
  }




}




