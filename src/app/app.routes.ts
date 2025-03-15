import { Routes } from '@angular/router';
import { HomeComponent } from './public/home/home.component';
import { ListOfCollectionsComponent } from './public/list-of-collections/list-of-collections.component';
import { CollectionComponent } from './public/collection/collection.component';
import { HeaderComponent } from './public/header/header.component';
import { CarouselComponent } from './public/carousel/carousel.component';



export const routes: Routes = [

    {path:'',redirectTo:'header',pathMatch:'full'},
    {path:'header',component:HeaderComponent},
    {path:'home',
        title:'Boy-Coté.fr',
        component: HomeComponent,
    },
    {path:'list',
        title:'List Of Collections',
        component: ListOfCollectionsComponent
    },
    {path:'collection',
        title:'Collection',
        component: CollectionComponent
    },
    {path:'carousel',
        title:'Carousel',
        component: CarouselComponent
    }


];

