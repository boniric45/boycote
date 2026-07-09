import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private http = inject(HttpClient);
  private router = inject(Router);

  login(username: string, password: string) {
    return this.http.post('/api/login.php', { username, password }, { withCredentials: true });
  }

  checkSession() {
    return this.http.get('/api/check-session.php', { withCredentials: true });
  }

  logout() {
    this.http.get('/api/logout.php', { withCredentials: true }).pipe(take(1)).subscribe(() => {
      this.router.navigate(['/admin/login']);
    });
  }

}
