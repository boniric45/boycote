import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { Product } from '../../../models/product';
import { AuthService } from '../../../services/auth.service';
import { ConsoleProductService } from '../../../services/console-product.service';
import { ProductService } from '../../../services/product.service';
import { MarqueService } from '../../../services/marque.service';
import { GenderService } from '../../../services/gender.service';
import { GarmentService } from '../../../services/garment.service';
import { Marque } from '../../../models/marque';
import { Garment } from '../../../models/garment';
import { Gender } from '../../../models/gender';

@Component({
  selector: 'app-console',
  imports: [RouterLink],
  templateUrl: './console.component.html',
  styleUrl: './console.component.scss',
})
export class ConsoleComponent implements OnInit {

  products:Product[] = [];
  marques:Marque[] = [];
  garments:Garment[] = [];
  genders:Gender[] = [];

  private router = inject(Router);
  private auth = inject(AuthService);
  private consoleProductService = inject(ConsoleProductService);
  private marqueService = inject(MarqueService);
  private garmentService = inject(GarmentService);
  private genderService = inject(GenderService);


  ngOnInit(): void {
    this.loadProducts();
    this.loadMarques();
    this.loadGarments();
    this.loadGenders();
  }

  loadProducts() {
    this.consoleProductService.getProducts().subscribe(res => this.products = res);
  }

  loadMarques(){
    this.marqueService.getMarques().subscribe(res => this.marques = res );
  }

  loadGarments(){
    this.garmentService.getAll().subscribe(res => this.garments = res);
  }

  loadGenders(){
    this.genderService.getAll().subscribe(res => this.genders = res)
  }

  getPreview(product: Product): string {
    return product.pathpictureone || 'assets/no-image.png';
  }

  edit(product: Product) {
    this.consoleProductService.product = product;
    this.router.navigateByUrl('admin/update')
    console.log(product.id);
  }

  delete(id: number) {
    if (confirm('Supprimer le produit avec l\'id: ' + id + ' ?')) {

      this.consoleProductService.deleteProductById(id)
        .subscribe(() => {
          window.location.reload();
        });
    }
  }

  editMarque(marque: Marque) {
    this.router.navigateByUrl('admin/update')
    console.log(marque.id);
  }

  deleteMarque(id: number) {
    if (confirm('Supprimer le produit avec l\'id: ' + id + ' ?')) {
      this.consoleProductService.deleteProductById(id)
        .subscribe(() => {
          window.location.reload();
        });
    }
  }

  editGarment(garment: Garment) {
    this.router.navigateByUrl('admin/update')
    console.log(garment.id);
  }

  deleteGarment(id: number) {
    if (confirm('Supprimer le vêtement avec l\'id: ' + id + ' ?')) {
      this.consoleProductService.deleteProductById(id)
        .subscribe(() => {
          window.location.reload();
        });
    }
  }

  editGender(gender: Gender) {
    this.router.navigateByUrl('admin/update')
    console.log(gender.id);
  }

  deleteGender(id: number) {
    if (confirm('Supprimer le genre avec l\'id: ' + id + ' ?')) {
      this.consoleProductService.deleteProductById(id)
        .subscribe(() => {
          window.location.reload();
        });
    }
  }



  logout(){
    this.auth.logout();
  }




}
