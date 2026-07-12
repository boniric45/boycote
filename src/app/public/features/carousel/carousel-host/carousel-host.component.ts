import { Component, computed, effect, inject, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../../../models/product';
import { CarouselService } from '../../../../services/carousel.service';
import { LogicInputService } from '../../../../services/logic-input.service';
import { LogicSelectService } from '../../../../services/logic-select.service';
import { AnnulationComponent } from "../../../annulation/annulation.component";
import { CabineComponent } from "../../../cabine/cabine.component";
import { LegalComponent } from "../../../legal/legal.component";
import { ProgressbarComponent } from "../../../progressbar/progressbar.component";
import { ContactComponent } from "../../contact/contact.component";
import { CustomerRequestComponent } from '../../customer-request/customer-request.component';
import { NoresultComponent } from '../../noresult/noresult.component';
import { CarouselInputComponent } from "../carousel-input/carousel-input.component";
import { CarouselProductComponent } from "../carousel-product/carousel-product.component";
import { CarouselSelectComponent } from "../carousel-select/carousel-select.component";
import { CarouselStandardComponent } from "../carousel-standard/carousel-standard.component";
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-carousel-host',
  imports: [
    CarouselStandardComponent,
    CarouselInputComponent,
    CarouselSelectComponent,
    CarouselProductComponent,
    CabineComponent,
    ContactComponent,
    AnnulationComponent,
    LegalComponent,
    CustomerRequestComponent,
    ProgressbarComponent,
    NoresultComponent],
  templateUrl: './carousel-host.component.html',
  styleUrl: './carousel-host.component.scss',
})
export class CarouselHostComponent {

  @Input() query!: string;
  @Input() filters!: any;

  private route = inject(ActivatedRoute);
  private logicSelectService = inject(LogicSelectService);
  private logicInputService = inject(LogicInputService);
  private carouselService = inject(CarouselService);

  // Mode du carousel
  mode = computed(() => this.carouselService.carouselMode());

  private _subParamMap = Subscription.EMPTY;

  searchQuery: string = '';
  filteredArticles: Product[] = [];
  idProduct: number = 0;
  requestProduct!: Product;

  constructor() {

    // Quand l’URL change → mettre à jour le signal
    this._subParamMap = this.route.paramMap.subscribe(params => {
      const mode = params.get('mode') as any;
      if (mode) {
        this.carouselService.setMode(mode);
      }
    });

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

  ngOnDestroy() {
    this._subParamMap.unsubscribe();
  }
}
