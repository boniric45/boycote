import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StopLandscapeComponent } from "./public/features/stop-landscape/stop-landscape.component";
import { FooterComponent } from "./public/footer/footer.component";
import { HeaderComponent } from "./public/header/header.component";
import { ApiService } from './services/api.service';
import { GarmentService } from './services/garment.service';
import { GenderService } from './services/gender.service';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, StopLandscapeComponent, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {


  private api = inject(ApiService);
  private garments = inject(GarmentService);
  private genders = inject(GenderService);

  marques = signal<string[]>([]);
  types = signal<string[]>([]);
  gendersList = signal<string[]>([]);

  ngOnInit() {
    this.api.getMarques().subscribe(m =>
      this.marques.set(m.map(x => x.name))
    );

    this.garments.getAll().subscribe(t =>
      this.types.set(t.map(x => x.name))
    );

    this.genders.getAll().subscribe(g =>
      this.gendersList.set(g.map(x => x.name))
    );
  }

  onSearchInput(value: string) {
    console.log('Recherche input:', value);
  }

  onSearchFilters(filters: any) {
    console.log('Recherche filtres:', filters);
  }

  onRefresh() {
    console.log('Reset recherche');
  }


}
