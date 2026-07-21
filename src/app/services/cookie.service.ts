import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CookieService {
  
// Méthode standard pour VOS cookies (Instagram-friendly)
  set(name: string, value: string, days = 365) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax; Secure`;
  }

  // Nouvelle méthode spécifique pour les cookies tiers/Stripe si besoin d'un SameSite=None
  setCrossSite(name: string, value: string, days = 365) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=None; Secure`;
  }

  get(name: string): string | null {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) {
        return decodeURIComponent(c.substring(nameEQ.length, c.length));
      }
    }
    return null;
  }

  delete(name: string) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax; Secure`;
  }

  getBoolean(name: string): boolean {
    return this.get(name) === 'true';
  }

  setBoolean(name: string, value: boolean, days: number = 365): void {
    this.set(name, value ? 'true' : 'false', days);
  }

}
