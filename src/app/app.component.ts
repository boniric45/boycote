import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from "./public/footer/footer.component";
import { HeaderComponent } from "./public/header/header.component";
import { ApiService } from './services/api.service';
import { GarmentService } from './services/garment.service';
import { GenderService } from './services/gender.service';
import { CookiesComponent } from "./public/features/cookies/cookies.component";
import { CookieService } from './services/cookie.service';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, CookiesComponent],
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

}
