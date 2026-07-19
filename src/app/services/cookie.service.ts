import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CookieService {

  set(name: string, value: string, days = 365) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=None; Secure`;
}

  get(name: string): string | null {
    return document.cookie
      .split('; ')
      .find(row => row.startsWith(name + '='))
      ?.split('=')[1] || null;
  }

  delete(name: string) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
  }

  getBoolean(name: string): boolean {
    return this.get(name) === 'true';
  }

  setBoolean(name: string, value: boolean, days: number = 365): void {
    this.set(name, value ? 'true' : 'false', days);
  }

  setConsent(value: 'accepted' | 'decline') {
    localStorage.setItem('cookie_consent', value);
  }

  hasConsent(): boolean {
    return localStorage.getItem('cookie_consent') !== null;
  }

}
