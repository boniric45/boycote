import { Routes } from "@angular/router";

export const PUBLIC_ROUTES: Routes = [
  {
    path: '',
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) },
      { path: 'login', loadComponent: () => import('./admin/login/login.component').then(m => m.LoginComponent) },
      { path: 'product/:id', loadComponent: () => import('./features/carousel/carousel-product/carousel-product.component').then(m => m.CarouselProductComponent) },
      { path: 'request/:id', loadComponent: () => import('./features/customer-request/customer-request.component').then(m => m.CustomerRequestComponent) },
      { path: 'success', loadComponent: () => import('./success/success.component').then(m => m.SuccessComponent) },
      { path: 'cancel', loadComponent: () => import('./cancel/cancel.component').then(m => m.CancelComponent) },
    ]
  }
];

