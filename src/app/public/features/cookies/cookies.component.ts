import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from '../../../app.component';
import { CarouselService } from '../../../services/carousel.service';
import { CookieService } from '../../../services/cookie.service';
import { CloseButtonComponent } from "../../../shared/close-button/close-button.component";
import { GtmService } from '../../../services/gtm.service';

// TEXTES FR / EN
const TEXTES = {
  en: {
    bannerTitle: 'Cookie Policy',
    heading: 'We use cookies',
    body: 'We use cookies to improve your experience, analyse traffic and personalise content. Accept all, decline or manage your preferences.',
    accept: 'ACCEPT ALL',
    decline: 'DECLINE',
    manage: 'MANAGE',
    legal: 'You can change your preferences at any time.',
    links: 'Privacy Policy · Cookie Policy · Legal Notice',
    lang: 'FR',
    manageTitle: 'Manage Preferences',
    manageIntro: 'Choose which cookies you allow. Essential cookies cannot be disabled.',
    essential: 'Essential',
    essentialDesc: 'Required for the site to work (cart, session, security). Cannot be disabled.',
    analytics: 'Analytics',
    analyticsDesc: 'Help us understand how visitors use the site. (Google Analytics)',
    marketing: 'Marketing',
    marketingDesc: 'Used to show personalised ads and track campaigns. (Meta Pixel/ TikTok Pixel)',
    save: 'SAVE PREFERENCES',
    cancel: 'CANCEL'
  },
  fr: {
    bannerTitle: 'Politique de cookies',
    heading: 'Nous utilisons des cookies',
    body: 'Nous utilisons des cookies pour améliorer votre expérience, analyser le trafic et personnaliser le contenu. Acceptez tout, refusez ou gérez vos préférences.',
    accept: 'TOUT ACCEPTER',
    decline: 'REFUSER',
    manage: 'PERSONNALISER',
    legal: 'Vous pouvez modifier vos préférences à tout moment.',
    links: 'Politique de confidentialité · Cookies · Mentions légales',
    lang: 'EN',
    manageTitle: 'Gérer mes préférences',
    manageIntro: 'Choisissez les cookies que vous autorisez. Les cookies essentiels ne peuvent pas être désactivés.',
    essential: 'Essentiels',
    essentialDesc: 'Nécessaires au fonctionnement du site (panier, session, sécurité). Non désactivables.',
    analytics: 'Statistiques',
    analyticsDesc: 'Nous aident à comprendre comment les visiteurs utilisent le site (Google Analytics, etc.).',
    marketing: 'Marketing',
    marketingDesc: 'Utilisés pour afficher des publicités personnalisées et suivre les campagnes.',
    save: 'ENREGISTRER',
    cancel: 'ANNULER'
  }
};


@Component({
  selector: 'app-cookies',
  imports: [CommonModule, FormsModule, CloseButtonComponent],
  templateUrl: './cookies.component.html',
  styleUrl: './cookies.component.scss',
})
export class CookiesComponent implements OnInit {

  private cookieService = inject(CookieService);
  private carouselService = inject(CarouselService);
  private gtmService = inject(GtmService); // 👈 2. Injection du service GTM
  private app = inject(AppComponent);

  // ÉTAT
  visible = true;
  manageOpen = false;
  langActuelle: 'en' | 'fr' = 'en';

  // PRÉFÉRENCES
  analyticsEnabled = false;
  marketingEnabled = false;
  essentialEnabled = true;

  ngOnInit() {

    // 1. Vérification stricte de la présence physique du cookie HTTP
    const hasHttpCookie = document.cookie.includes('cookie_consent=');
    const consent = this.cookieService.get('cookie_consent');     // Si le cookie HTTP est là, on lit normalement

    if (hasHttpCookie && consent) {
      this.visible = false;
      this.analyticsEnabled = this.cookieService.getBoolean('analytics');
      this.marketingEnabled = this.cookieService.getBoolean('marketing');
      this.gtmService.updateConsent(this.analyticsEnabled, this.marketingEnabled);
      return;
    }

    // 2. Si le cookie HTTP est absent (supprimé), on force l'affichage de la bannière 
    // et on nettoie uniquement les clés de cookies du LocalStorage (le panier est préservé)
    this.visible = true;
    try {
      localStorage.removeItem('cookie_consent');
      localStorage.removeItem('analytics');
      localStorage.removeItem('marketing');
    } catch (e) { }
  }

  get t() { return TEXTES[this.langActuelle]; }

  switchLang() {
    this.langActuelle = this.langActuelle === 'en' ? 'fr' : 'en';
  }

  // TOUT ACCEPTER
  acceptAll() {
    this.analyticsEnabled = true;
    this.marketingEnabled = true;

    this.cookieService.set('cookie_consent', 'all');
    this.cookieService.set('analytics', 'true');
    this.cookieService.set('marketing', 'true');

    // 👈 Synchronisation avec Google Tag
    this.gtmService.updateConsent(true, true);

    this.visible = false;
    this.app.isCookiesIsNotSaved.set(false);
  }


  // Dans cookies.component.ts

  savePreferences() {
    this.cookieService.set('cookie_consent', 'custom');
    this.cookieService.set('analytics', this.analyticsEnabled ? 'true' : 'false');
    this.cookieService.set('marketing', this.marketingEnabled ? 'true' : 'false');

    // Envoi strict selon l'état des switchs UI
    this.gtmService.updateConsent(this.analyticsEnabled, this.marketingEnabled);

    this.manageOpen = false;
    this.visible = false;
    this.app.isCookiesIsNotSaved.set(false);
  }

  // TOUT REFUSER
  decline() {
    this.analyticsEnabled = false;
    this.marketingEnabled = false;

    this.cookieService.set('cookie_consent', 'decline');
    this.cookieService.set('analytics', 'false');
    this.cookieService.set('marketing', 'false');

    // 👈 Synchronisation avec Google Tag
    this.gtmService.updateConsent(false, false);

    this.visible = false;
    this.app.isCookiesIsNotSaved.set(false);
  }

  openManage() {
    this.analyticsEnabled = this.cookieService.getBoolean('analytics');
    this.marketingEnabled = this.cookieService.getBoolean('marketing');
    this.essentialEnabled = true;

    this.manageOpen = true;
  }


  // FERMER LE MANAGE
  closeManage() {
    this.cookieService.set('cookie_consent', 'custom');
    this.cookieService.set('analytics', this.analyticsEnabled ? 'true' : 'false');
    this.cookieService.set('marketing', this.marketingEnabled ? 'true' : 'false');

    // 👈 Synchronisation avec Google Tag
    this.gtmService.updateConsent(this.analyticsEnabled, this.marketingEnabled);

    this.carouselService.setMode('standard');
    this.manageOpen = false;
    this.visible = false;
    this.app.isCookiesIsNotSaved.set(false);
  }

  onClickMention(event: MouseEvent) {
    this.visible = false;
    this.app.isCookiesIsNotSaved.set(false);
    this.carouselService.setMode('notice');
  }
}