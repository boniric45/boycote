import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { CarouselHostComponent } from './public/features/carousel/carousel-host/carousel-host.component';
import { ConstructionComponent } from "./public/features/construction/construction.component";
import { CookiesComponent } from "./public/features/cookies/cookies.component";
import { FooterComponent } from "./public/footer/footer.component";
import { HeaderComponent } from "./public/header/header.component";
import { CookieService } from './services/cookie.service';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, FooterComponent, CookiesComponent, RouterOutlet, ConstructionComponent, CarouselHostComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  private cookiesService = inject(CookieService);
  private router = inject(Router);
  noLayoutRoutes = [
    '/admin',
    '/console',
    '/success',
    '/cancel',
    '/customer-request'
  ];

  isCookiesIsNotSaved = signal(true);
  searchQuery = '';
  searchFilters: any = null;
  construction = true;
  showLayout = false;
  showHost = false;

  ngOnInit() {

    const consent = this.cookiesService.get('cookie_consent');
    if (consent) {
      this.isCookiesIsNotSaved.set(false);
    }

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects;
        console.log('URL > ', url);

        // -------------------------
        // 1) Pages SANS layout
        // -------------------------
        if (
          url.startsWith('/admin') ||
          url.startsWith('/console') ||
          url.startsWith('/success') ||
          url.startsWith('/cancel')
        ) {
          this.showLayout = false;
          this.showHost = false;
          return;
        }

        // -------------------------
        // 2) Page construction
        // -------------------------
        if (url.startsWith('/construction')) {
          this.construction = true;
          this.showLayout = false;
          this.showHost = false;
          return;
        }

        // -------------------------
        // 3) PAGE D’ACCUEIL → Host ON
        // -------------------------
        if (url === '/' || url.startsWith('/home')) {
          this.showLayout = true;
          this.showHost = true;
          return;
        }

        // -------------------------
        // 4) Pages publiques normales → Host ON
        // -------------------------
        if (url.startsWith('/product') || url.startsWith('/request')) {
          this.showLayout = true;
          this.showHost = true;
          this.construction = false
          return;
        }

        // -------------------------
        // 5) Par défaut → layout SANS host
        // -------------------------
        this.showLayout = true;
        this.showHost = false;
      }
    });
  }

  onSearch(query: string) {
    this.searchQuery = query;
  }

  onSearchFilters(filters: any) {
    this.searchFilters = filters;
  }

  exitConstruction() {
    this.construction = false;
    this.showLayout = false;
    this.showHost = false;
    this.router.navigate(['/login']);
  }

  exitLogin() {
    this.construction = false;
    this.showLayout = true;
    this.showHost = true;
  }

}
