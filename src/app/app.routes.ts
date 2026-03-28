import { Routes } from '@angular/router';
import { SuccessComponent } from './public/success/success.component';
import { CancelComponent } from './public/cancel/cancel.component';
import { CartComponent } from './public/cart/cart.component';
import { AddProductComponent } from './public/add-product/add-product.component';
import { CabineComponent } from './public/cabine/cabine.component';
import { TestComponent } from './home/test/test.component';
import { ContactComponent } from './public/features/contact/contact.component';
import { LegalComponent } from './public/legal/legal.component';
import { AnnulationComponent } from './public/annulation/annulation.component';
import { PanierComponent } from './public/panier/panier.component';
import { CarouselTestComponent } from './public/carousel-test/carousel-test.component';
import { BoycoteProductComponent } from './public/features/boycote-product/boycote-product.component';
import { BoycoteComponent } from './public/features/boycote/boycote.component';
import { boycoteRoutes } from './public/features/boycote/boycote.route';


export const routes: Routes = [

    {path:'',redirectTo:'home',pathMatch:'full'},
    {
        path:'home',
        title:'Boy-Coté.fr',
        children:boycoteRoutes
    },

    {
    path:'carouseltest',
    title:'Test',
    component:CarouselTestComponent
    },
    
    {path:'carousel',
    title:'Carousel',
    component: BoycoteComponent
    },
    {path:'product',
    title:'Product',
    component: BoycoteProductComponent
    },
    {path:'success',
    title:'Success',
    component: SuccessComponent
    },
    {path:'cancel',
    title:'Cancel',
    component: CancelComponent
    },
    {path:'cart',
    title:'Cart',
    component: CartComponent
    },
    {path:'console',
    title:'Admin',
    component: AddProductComponent
    },
    {path:'cabine',
    title:'Cabine',
    component: CabineComponent
    },
    {path:'test',
    title:'Test',
    component: TestComponent
    },
    {path:'contact',
    title:'Contact',
    component: ContactComponent
    },
    {path:'mention',
    title:'Mentions',
    component: LegalComponent
    },
    {path:'annulation',
    title:'Annulation',
    component: AnnulationComponent
    },
    {path:'panier',
    title:'Panier',
    component: PanierComponent
    },





];

