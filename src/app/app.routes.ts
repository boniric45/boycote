import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';
import { CabinUpdateComponent } from './public/admin/cabin-update/cabin-update.component';
import { CabineAdminComponent } from './public/admin/cabine-admin/cabine-admin.component';
import { ConsoleComponent } from './public/admin/console/console.component';
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
    path:'v',
    component:CabinUpdateComponent
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
    canMatch: [adminGuard],
    loadComponent: () =>
      import('./public/admin/console/console.component').then(m => m.ConsoleComponent)
  },
  {
    path: 'admin',
    // canMatch: [adminGuard],
    component: BoycoteComponent
  },
    {
    path: 'console',
    // canMatch: [adminGuard],
    component: ConsoleComponent
  },
  {
    path: 'console/add',
    // canMatch: [adminGuard],
    loadComponent: () =>
      import('./public/admin/product-form/product-form.component').then(m => m.ProductFormComponent)
  },
  {
    path: 'console/update',
    // canMatch: [adminGuard],
    loadComponent: () =>
      import('./public/admin/product-form/product-form.component').then(m => m.ProductFormComponent)
  },

  // {
  //   path: 'admin/add',
  //   canMatch: [adminGuard],
  //   loadComponent: () =>
  //     import('./public/admin/product-form/product-form.component').then(m => m.ProductFormComponent)
  // },
   { path: 'admin2/cabin/add',
    loadComponent:()=> import('./public/admin/cabin-form/cabin-form.component').then(m => m.CabinFormComponent)
   },

  { path: 'admin2/cabin/edit/:id',
    loadComponent:()=> import('./public/admin/cabin-update/cabin-update.component').then(m => m.CabinUpdateComponent)
   },
    {
    path: 'admin2/add',
    // canMatch: [adminGuard],
    loadComponent: () =>
      import('./public/admin/product-form/product-form.component').then(m => m.ProductFormComponent)
  },
    {
    path: 'admin2/update',
    // canMatch: [adminGuard],
    loadComponent: () =>
      import('./public/admin/product-update/product-update.component').then(m => m.ProductUpdateComponent)
  },
  {
    path: 'admin/update',
    canMatch: [adminGuard],
    loadComponent: () =>
      import('./public/admin/product-update/product-update.component').then(m => m.ProductUpdateComponent)
  },
  {
    path: 'admin/marque/add',
    // canMatch: [adminGuard],
    loadComponent: () => import('./public/admin/add-marque/add-marque.component')
      .then(c => c.AddMarqueComponent)
  },
  {
    path: 'admin/marque/edit/:id',
    // canMatch: [adminGuard],
    loadComponent: () => import('./public/admin/edit-marque/edit-marque.component')
      .then(c => c.EditMarqueComponent)
  },
    {
    path: 'admin/garment/add',
    // canMatch: [adminGuard],
    loadComponent: () => import('./public/admin/add-garment/add-garment.component')
      .then(c => c.AddGarmentComponent)
  },
  {
    path: 'admin/garment/edit/:id',
    // canMatch: [adminGuard],
    loadComponent: () => import('./public/admin/edit-garment/edit-garment.component')
      .then(c => c.EditGarmentComponent)
  },
      {
    path: 'admin/gender/add',
    // canMatch: [adminGuard],
    loadComponent: () => import('./public/admin/add-gender/add-gender.component')
      .then(c => c.AddGenderComponent)
  },
  {
    path: 'admin/gender/edit/:id',
    // canMatch: [adminGuard],
    loadComponent: () => import('./public/admin/edit-gender/edit-gender.component')
      .then(c => c.EditGenderComponent)
  },


  // AUTRES ROUTES
  {
    path: 'carousel',
    title: 'Carousel',
    component: BoycoteComponent
  },
  {
    path: 'product/:id',
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
  },
  {
    path: 'cabs',
    title:'cabs',
    component: CabineAdminComponent
  }
];
