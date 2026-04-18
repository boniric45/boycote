import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoginService {

  private http = inject(HttpClient);

  login(username: string, password: string) {
  return this.http.post('/api/login.php', { username, password }, { withCredentials: true });
  }

  
}
