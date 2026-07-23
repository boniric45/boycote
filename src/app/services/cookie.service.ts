import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class CookieService {
  
  set(name: string, value: string, days = 365) {
    // 1. Écriture Cookie standard
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax; Secure`;
    
    // 2. Double sécurité LocalStorage (très utile pour Instagram WebView)
    try {
      localStorage.setItem(name, value);
    } catch (e) {
      // Ignore si le stockage est bloqué
    }
  }

  get(name: string): string | null {
    // 1. Essaye de lire depuis le cookie
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) {
        return decodeURIComponent(c.substring(nameEQ.length, c.length));
      }
    }

    // 2. Fallback sur le LocalStorage si le cookie est absent (anti-bug Instagram)
    try {
      return localStorage.getItem(name);
    } catch (e) {
      return null;
    }
  }

  delete(name: string) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax; Secure`;
    try {
      localStorage.removeItem(name);
    } catch (e) {}
  }

  getBoolean(name: string): boolean {
    return this.get(name) === 'true';
  }

  setBoolean(name: string, value: boolean, days: number = 365): void {
    this.set(name, value ? 'true' : 'false', days);
  }
}