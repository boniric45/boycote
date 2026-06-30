import { Routes } from '@angular/router';
import { EmptyComponent } from './public/features/empty/empty.component';

export const routes: Routes = [

  // PUBLIC
  { path: '', loadChildren: () => import('./public/public.routes').then(m => m.PUBLIC_ROUTES) },

  // LOGIN
  { path: 'admin', loadComponent: () => import('./public/admin/login/login.component').then(m => m.LoginComponent) },

  // ADMIN + CONSOLE
  { path: 'console', loadChildren: () => import('./public/admin/console/console.route').then(m => m.CONSOLE_ROUTES) },



  // 404
  { path: '**', redirectTo: '' }


];


