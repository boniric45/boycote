import { Routes } from "@angular/router";
import { adminGuard } from "../../../guards/admin.guard";
import { AddGarmentComponent } from "../add-garment/add-garment.component";
import { AddGenderComponent } from "../add-gender/add-gender.component";
import { AddMarqueComponent } from "../add-marque/add-marque.component";
import { CabinAddFormComponent } from "../cabin-add-form/cabin-add-form.component";
import { CabinUpdateFormComponent } from "../cabin-update-form/cabin-update-form.component";
import { CabineAdminComponent } from "../cabine-admin/cabine-admin.component";
import { EditGarmentComponent } from "../edit-garment/edit-garment.component";
import { EditGenderComponent } from "../edit-gender/edit-gender.component";
import { EditMarqueComponent } from "../edit-marque/edit-marque.component";
import { ProductFormComponent } from "../product-form/product-form.component";
import { ProductUpdateComponent } from "../product-update/product-update.component";
import { ConsoleComponent } from "./console.component";
import { ConsoleLayoutComponent } from "../console-layout/console-layout.component";

export const CONSOLE_ROUTES: Routes = [
  {
    path: '',
    canMatch: [adminGuard],
    component: ConsoleLayoutComponent,
    children: [
      { path: '', component: ConsoleComponent },
      { path: 'add', component: ProductFormComponent },
      { path: 'update', component: ProductUpdateComponent },
      { path: 'marque/add', component: AddMarqueComponent },
      { path: 'marque/edit/:id', component: EditMarqueComponent },
      { path: 'garment/add', component: AddGarmentComponent },
      { path: 'garment/edit/:id', component: EditGarmentComponent },
      { path: 'gender/add', component: AddGenderComponent },
      { path: 'gender/edit/:id', component: EditGenderComponent },
      { path: 'cabin', component: CabineAdminComponent },
      { path: 'cabin/add', component: CabinAddFormComponent },
      { path: 'cabin/edit/:id', component: CabinUpdateFormComponent }
    ]
  }
];
