import { Injectable, inject } from '@angular/core';
import { CookieService } from './cookie.service';

declare const window: any;

@Injectable({
  providedIn: 'root',
})
export class GtmService {
  private cookieService = inject(CookieService);

  /**
   * À appeler au démarrage (AppComponent) si l'utilisateur avait déjà accepté
   */
  initConsent(): void {
    const consentSaved = this.cookieService.get('cookie_consent');

    if (consentSaved) {
      const analytics = this.cookieService.getBoolean('analytics');
      const marketing = this.cookieService.getBoolean('marketing');
      this.updateConsent(analytics, marketing);
    }
  }

updateConsent(analytics: boolean, marketing: boolean): void {
  window.dataLayer = window.dataLayer || [];

  const statusAnalytics = analytics ? 'granted' : 'denied';
  const statusMarketing = marketing ? 'granted' : 'denied';

  // 1. Appel de l'API consent selon la syntaxe officielle gtag/dataLayer
  window.dataLayer.push(function() {
    // @ts-ignore
    gtag('consent', 'update', {
      'analytics_storage': statusAnalytics,
      'ad_storage': statusMarketing,
      'ad_user_data': statusMarketing,
      'ad_personalization': statusMarketing
    });
  });

  // 2. Événement personnalisé pour déclencher des balises dans votre conteneur GTM
  window.dataLayer.push({
    event: 'cookie_consent_update',
    consent_analytics: analytics,
    consent_marketing: marketing,
  });
}

  /**
   * Déclenche la page vue virtuelle lors des changements de routes
   */
  trackPageView(url: string): void {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'page_view',
      page_path: url,
      page_location: window.location.href,
      page_title: document.title,
    });
  }
}