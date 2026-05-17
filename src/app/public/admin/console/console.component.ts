import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { Garment } from '../../../models/garment';
import { Gender } from '../../../models/gender';
import { Marque } from '../../../models/marque';
import { Product } from '../../../models/product';
import { AuthService } from '../../../services/auth.service';
import { ConsoleProductService } from '../../../services/console-product.service';
import { GarmentService } from '../../../services/garment.service';
import { GenderService } from '../../../services/gender.service';
import { MarqueService } from '../../../services/marque.service';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-console',
  imports: [RouterLink, DragDropModule],
  templateUrl: './console.component.html',
  styleUrl: './console.component.scss',
})
export class ConsoleComponent implements OnInit {

  products: Product[] = [];
  marques: Marque[] = [];
  garments: Garment[] = [];
  genders: Gender[] = [];

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

  drop(event: CdkDragDrop<Product[]>) {
    moveItemInArray(this.products, event.previousIndex, event.currentIndex);

    // 🔥 Mettre à jour l’ordre dans la base
    this.saveOrder();
  }

  saveOrder() {
    const ordered = this.products.map((p, index) => ({
      id: p.id,
      order: index
    }));

    this.consoleProductService.updateOrderList(ordered)
      .subscribe(() => console.log("Ordre mis à jour"));
  }

  dropMarques(event: CdkDragDrop<Marque[]>) {
    moveItemInArray(this.marques, event.previousIndex, event.currentIndex);
    this.saveMarquesOrder();
  }

  saveMarquesOrder() {
    const ordered = this.marques.map((m, index) => ({
      id: m.id,
      order: index
    }));

    this.marqueService.updateOrderList(ordered)
      .subscribe(() => console.log("Ordre marques mis à jour"));
  }

  dropGenders(event: CdkDragDrop<Gender[]>) {
    moveItemInArray(this.genders, event.previousIndex, event.currentIndex);
    this.saveGendersOrder();
  }

  saveGendersOrder() {
    const ordered = this.genders.map((g, index) => ({
      id: g.id,
      order: index
    }));

    this.genderService.updateOrderList(ordered)
      .subscribe(() => console.log("Ordre genres mis à jour"));
  }

  dropGarments(event: CdkDragDrop<Garment[]>) {
    moveItemInArray(this.garments, event.previousIndex, event.currentIndex);
    this.saveGarmentsOrder();
  }

  saveGarmentsOrder() {
    const ordered = this.garments.map((g, index) => ({
      id: g.id,
      order: index
    }));

    this.garmentService.updateOrderList(ordered)
      .subscribe(() => console.log("Ordre vêtements mis à jour"));
  }


  loadProducts() {
    this.consoleProductService.getProducts().subscribe(res => this.products = res);
  }

  loadMarques() {
    this.marqueService.getMarques().subscribe(res => this.marques = res);
  }

  loadGarments() {
    this.garmentService.getAll().subscribe(res => this.garments = res);
  }

  loadGenders() {
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

  logout() {
    this.auth.logout();
  }

}
