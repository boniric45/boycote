import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CookiesComponent } from "./public/features/cookies/cookies.component";
import { FooterComponent } from "./public/footer/footer.component";
import { HeaderComponent } from "./public/header/header.component";
import { CookieService } from './services/cookie.service';
import { CarouselHostComponent } from './public/features/carousel/carousel-host/carousel-host.component';


@Component({
  selector: 'app-root',
  imports: [HeaderComponent, FooterComponent, CookiesComponent, CarouselHostComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  private cookiesService = inject(CookieService);
  isCookiesIsNotSaved = signal(true);

  ngOnInit() {
    // COOKIES
    const consent = this.cookiesService.get('cookie_consent');
    if (consent) {
      this.isCookiesIsNotSaved.set(false);
    }
  }

  searchQuery = '';
  searchFilters: any = null;

  onSearch(query: string) {
    this.searchQuery = query;
  }

  onSearchFilters(filters: any) {
    this.searchFilters = filters;
  }


}
