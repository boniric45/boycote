import { Component, computed, HostListener, inject, OnInit,signal,ViewEncapsulation } from '@angular/core';
import { MatSelectModule } from "@angular/material/select";
import { Marque } from '../../models/marque';
import { ApiService } from '../../services/api.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';


@Component({
  selector: 'app-test',
  imports: [MatSelectModule,MatCheckboxModule,MatFormFieldModule,MatOptionModule],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class TestComponent implements OnInit {

  private apiService = inject(ApiService);

  // SIGNALS
  marques = signal<Marque[]>([]);
  selectedMarques = signal<string[]>([]);
  isOpen = signal(false);

  // Label dynamique
  label = computed(() => {
    const sel = this.selectedMarques();
    if (sel.length === 0) return 'Marques';
    if (sel.length === 1) return sel[0];
    return 'Marques: '+sel.length + ' sélectionnées';
  });

  ngOnInit(): void {
    // Même appel API qu'avant
    this.apiService.getMarques().subscribe(m => this.marques.set(m));
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.isOpen.update(v => !v);
  }

  toggleMarque(name: string, event: Event) {
    event.stopPropagation();
    this.selectedMarques.update(list => {
      const idx = list.indexOf(name);
      return idx > -1 ? list.filter(m => m !== name) : [...list, name];
    });
  }

  isSelected(name: string): boolean {    
    return this.selectedMarques().includes(name);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const el = event.target as HTMLElement;
    if (!el.closest('app-mac-select')) {
      this.isOpen.set(false);
    }
  }

}
