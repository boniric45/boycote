import { Routes } from '@angular/router';
import { HomeComponent } from './public/home/home.component';

import { HeaderComponent } from './public/header/header.component';
import { BoycoteComponent } from './public/boycote/boycote.component';


export const routes: Routes = [

    {path:'',redirectTo:'home',pathMatch:'full'},
    {path:'header',component:HeaderComponent},
    {path:'home',
        title:'Boy-Coté.fr',
        component:HomeComponent,
    },
    {path:'carousel',
        title:'Carousel',
        component: BoycoteComponent
    }

];

