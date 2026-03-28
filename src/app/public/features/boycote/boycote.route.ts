import {  Routes } from "@angular/router";
import { BoycoteComponent } from "./boycote.component";
import { BoycoteProductComponent } from "../boycote-product/boycote-product.component";

export const boycoteRoutes: Routes = [
    
    {
    path:'',
    component:BoycoteComponent
    },
    {
    path:'product',
    title:'Boy-Coté - Product',
    component:BoycoteProductComponent
    },




]