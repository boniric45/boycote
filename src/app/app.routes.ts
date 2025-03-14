import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './public/home/home.component';
import { ListOfCollectionsComponent } from './public/list-of-collections/list-of-collections.component';
import { CollectionComponent } from './public/collection/collection.component';



export const routes: Routes = [

    {path:'',redirectTo:'home',pathMatch:'full'},
    {path:'**',component:HomeComponent},
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
    }


];

