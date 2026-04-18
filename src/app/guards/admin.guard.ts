import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { map } from 'rxjs/operators';

export const adminGuard: CanMatchFn = () => {

  const http = inject(HttpClient);
  const router = inject(Router);

  return http.get('/api/check-session.php', { withCredentials: true }).pipe(
    map((res: any) => {
      return res.logged === true
        ? true
        : router.parseUrl('/admin/login');
    })
  );
};
