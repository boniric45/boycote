import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from "@angular/router";
import { CookieService } from '../../../services/cookie.service';


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
    analyticsDesc: 'Help us understand how visitors use the site (Google Analytics, etc.).',
    marketing: 'Marketing',
    marketingDesc: 'Used to show personalised ads and track campaigns.',
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
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cookies.component.html',
  styleUrl: './cookies.component.scss',
})
export class CookiesComponent implements OnInit {

  ngOnInit() {
    const consent = this.cookieService.get('cookie_consent');

    if (consent) {
      this.visible = false; // bannière déjà gérée
      this.analyticsEnabled = this.cookieService.get('analytics') === 'true';
      this.marketingEnabled = this.cookieService.get('marketing') === 'true';
    }
  }

  private cookieService = inject(CookieService);

// ÉTAT
  visible      = true;
  manageOpen   = false;
  langActuelle: 'en' | 'fr' = 'en';

  // PRÉFÉRENCES
  analyticsEnabled = false;
  marketingEnabled = false;

  // TEXTES ACTIFS
  get t() { return TEXTES[this.langActuelle]; }

  refreshPage(){
    window.location.reload();
  }

  // CHANGER LANGUE
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

  this.visible = false;
  this.refreshPage();
}

  // TOUT REFUSER
  decline() {
  this.analyticsEnabled = false;
  this.marketingEnabled = false;

  this.cookieService.set('cookie_consent', 'decline');
  this.cookieService.set('analytics', 'false');
  this.cookieService.set('marketing', 'false');

  this.visible = false;
  this.refreshPage();
  }

  // OUVRIR MANAGE
  openManage()  { this.manageOpen = true; }
  closeManage() { this.manageOpen = false; }

  // SAUVEGARDER PRÉFÉRENCES
  savePreferences() {
  this.cookieService.set('cookie_consent', 'custom');
  this.cookieService.set('analytics', String(this.analyticsEnabled));
  this.cookieService.set('marketing', String(this.marketingEnabled));

  this.manageOpen = false;
  this.visible = false;
  this.refreshPage();
  }







}
