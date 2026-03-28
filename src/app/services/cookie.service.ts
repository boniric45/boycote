import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CookieService {

  set(name: string, value: string, days = 365) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
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

  
}
