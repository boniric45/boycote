import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';
import { AnnulationComponent } from './public/annulation/annulation.component';
import { CabineComponent } from './public/cabine/cabine.component';
import { CancelComponent } from './public/cancel/cancel.component';
import { CartComponent } from './public/cart/cart.component';
import { BoycoteComponent } from './public/features/boycote/boycote.component';
import { boycoteRoutes } from './public/features/boycote/boycote.route';
import { CarouselProductComponent } from './public/features/carousel/carousel-product/carousel-product.component';
import { ContactComponent } from './public/features/contact/contact.component';
import { LegalComponent } from './public/legal/legal.component';
import { PanierComponent } from './public/panier/panier.component';
import { SuccessComponent } from './public/success/success.component';
import { LoginComponent } from './public/admin/login/login.component';

export const routes: Routes = [

  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // LOGIN PUBLIC
  {
    path: 'home',
   // canMatch: [adminGuard], 
    title: 'Boy-Coté.fr',
    children: boycoteRoutes
  },
  {
    path: 'admin/login',
    loadComponent: () =>
      import('./public/admin/login/login.component').then(m => m.LoginComponent)
  },
  {
    path:'home/admin/login',
    component:BoycoteComponent // changer pour loginComponent en production BoycoteComponent en Dev
  },
  

  // ADMIN PROTÉGÉ
  // {
  //   path: 'admin',
  //   canMatch: [adminGuard],
  //   loadComponent: () =>
  //     import('./public/admin/console/console.component').then(m => m.ConsoleComponent)
  // },
    {
    path: 'admin2', // à supprimer plus tard
   // canMatch: [adminGuard],
    loadComponent: () =>
      import('./public/admin/console/console.component').then(m => m.ConsoleComponent)
  },
  {
    path: 'admin',
   // canMatch: [adminGuard],
    component: BoycoteComponent
  },
  {
    path: 'admin/add',
   // canMatch: [adminGuard],
    loadComponent: () =>
      import('./public/admin/product-form/product-form.component').then(m => m.ProductFormComponent)
  },
  {
    path: 'admin/update',
   // canMatch: [adminGuard],
    loadComponent: () =>
      import('./public/admin/product-update/product-update.component').then(m => m.ProductUpdateComponent)
  },

  // AUTRES ROUTES
  {
    path: 'carousel',
    title: 'Carousel',
    component: BoycoteComponent
  },
  {
    path: 'product',
    title: 'Product',
    component: CarouselProductComponent
  },
  {
    path: 'success',
    title: 'Success',
    component: SuccessComponent
  },
  {
    path: 'cancel',
    title: 'Cancel',
    component: CancelComponent
  },
  {
    path: 'cart',
    title: 'Cart',
    component: CartComponent
  },
  {
    path: 'cabine',
    title: 'Cabine',
    component: CabineComponent
  },
  {
    path: 'contact',
    title: 'Contact',
    component: ContactComponent
  },
  {
    path: 'mention',
    title: 'Mentions',
    component: LegalComponent
  },
  {
    path: 'annulation',
    title: 'Annulation',
    component: AnnulationComponent
  },
  {
    path: 'panier',
    title: 'Panier',
    component: PanierComponent
  }

];
