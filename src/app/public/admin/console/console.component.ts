import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { Cabin } from '../../../models/cabin';
import { Garment } from '../../../models/garment';
import { Gender } from '../../../models/gender';
import { Marque } from '../../../models/marque';
import { Product } from '../../../models/product';
import { TruncatePipe } from "../../../pipes/truncate.pipe";
import { AuthService } from '../../../services/auth.service';
import { CabineService } from '../../../services/cabine.service';
import { ConsoleProductService } from '../../../services/console-product.service';
import { GarmentService } from '../../../services/garment.service';
import { GenderService } from '../../../services/gender.service';
import { MarqueService } from '../../../services/marque.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-console',
  imports: [RouterLink, DragDropModule, FormsModule, TruncatePipe],
  templateUrl: './console.component.html',
  styleUrl: './console.component.scss',
})
export class ConsoleComponent implements OnInit {

  products: Product[] = [];
  marques: Marque[] = [];
  garments: Garment[] = [];
  genders: Gender[] = [];
  cabins: Cabin[] = [];
  searchProduct: string = '';
  searchCabin: string = '';
  numberProduct: number = 0;

  private router = inject(Router);
  private auth = inject(AuthService);
  private consoleProductService = inject(ConsoleProductService);
  private marqueService = inject(MarqueService);
  private garmentService = inject(GarmentService);
  private genderService = inject(GenderService);
  private cabinService = inject(CabineService);
  private _subUpdateOrderList = Subscription.EMPTY;
  private _subMarqueUpdateOrderList = Subscription.EMPTY;
  private _subGenderUpdateOrderList = Subscription.EMPTY;
  private _subGarmentOrderList = Subscription.EMPTY;
  private _subGetProduct = Subscription.EMPTY;
  private _subGetAllCabin = Subscription.EMPTY;
  private _subGetMarques = Subscription.EMPTY;
  private _subGetAllGarment = Subscription.EMPTY;
  private _subGetAllGender = Subscription.EMPTY;
  private _subDeleteCabin = Subscription.EMPTY;
  private _subDeleteProduct = Subscription.EMPTY;
  private _subDeleteMarque = Subscription.EMPTY;
  private _subDeleteGarment = Subscription.EMPTY;
  private _subDeleteGender = Subscription.EMPTY;


  ngOnInit(): void {
    this.loadProducts();
    this.loadCabins();
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

    this._subUpdateOrderList = this.consoleProductService.updateOrderList(ordered)
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

    this._subMarqueUpdateOrderList = this.marqueService.updateOrderList(ordered)
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

    this._subGenderUpdateOrderList = this.genderService.updateOrderList(ordered)
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

    this._subGarmentOrderList = this.garmentService.updateOrderList(ordered)
      .subscribe(() => console.log("Ordre vêtements mis à jour"));
  }

  loadProducts() {

    this._subGetProduct = this.consoleProductService.getProducts().subscribe(res => {
      this.products = res
      if (this.products.length != 0) {
        this.numberProduct = this.products.length;
      }
    });

  }

  loadCabins() {
    this._subGetAllCabin = this.cabinService.getAllCabin().subscribe(c => {
      this.cabins = c;
    })
  }

  loadMarques() {
    this._subGetMarques = this.marqueService.getMarques().subscribe(res => {
      const sorted = [...res].sort((a, b) => a.display_order - b.display_order);
      this.marques = res;
    });
  }

  loadGarments() {
    this._subGetAllGarment = this.garmentService.getAll().subscribe(res => {
      const sorted = [...res].sort((a, b) => a.display_order - b.display_order);
      this.garments = res
    });
  }

  loadGenders() {
    this._subGetAllGender = this.genderService.getAll().subscribe(res => {
      const sorted = [...res].sort((a, b) => a.display_order - b.display_order);
      this.genders = res
    });
  }

  getPreviewProduct(product: Product): string {
    return product.pathpictureone || 'assets/no-image.png';
  }

  editProduct(product: Product) {
    this.consoleProductService.product = product;
    this.router.navigateByUrl('console/update')
  }

  deleteProduct(id: number) {
    if (confirm('Supprimer le produit avec l\'id: ' + id + ' ?')) {

      this._subDeleteProduct = this.consoleProductService.deleteProductById(id)
        .subscribe(() => {
          window.location.reload();
        });
    }
  }

  editCabin(cabin: any) {
    this.router.navigateByUrl('console/cabin/edit/' + cabin.id);
  }

  getPreviewCabin(cabin: Cabin): string {
    return cabin.picturecabin || 'assets/no-image.png';
  }

  deleteCabin(id: number) {
    if (confirm("Supprimer cette cabine ?")) {
      this._subDeleteCabin = this.cabinService.deleteCabin(id).subscribe(() => {
        alert('Article Supprimé');
        this.loadCabins();
      });
    }
  }

  editMarque(marque: Marque) {
    this.router.navigateByUrl('console/marque/edit/' + marque.id);
  }

  deleteMarque(id: number) {
    if (!confirm("Supprimer cette marque ?")) return;

    this._subDeleteMarque = this.marqueService.deleteMarque(id).subscribe(res => {
      this.loadMarques(); // recharge la liste
    });
  }

  editGarment(garment: Garment) {
    this.router.navigateByUrl('console/garment/edit/' + garment.id)
  }

  deleteGarment(id: number) {
    if (confirm('Supprimer le vêtement avec l\'id: ' + id + ' ?')) {
      this._subDeleteGarment = this.garmentService.deleteGarment(id)
        .subscribe(() => {
          window.location.reload();
        });
    }
  }

  editGender(gender: Gender) {
    this.router.navigateByUrl('console/gender/edit/' + gender.id)
  }

  deleteGender(id: number) {
    if (confirm('Supprimer le genre avec l\'id: ' + id + ' ?')) {
      this._subDeleteGender = this.genderService.deleteGender(id)
        .subscribe(() => {
          window.location.reload();
        });
    }
  }

  logout() {
    this.auth.logout();
  }

  get productsFiltered(): Product[] {
    const f = this.searchProduct.toLowerCase().trim();
    if (!f) return this.products;

    return this.products.filter(p =>
      p.sku?.toLowerCase().includes(f) ||
      p.name?.toLowerCase().includes(f) ||
      p.marque?.toLowerCase().includes(f) ||
      p.type?.toLowerCase().includes(f)
    );
  }

  get cabinFiltered(): Cabin[] {
    const f = this.searchCabin.toLowerCase().trim();
    if (!f) return this.cabins;

    return this.cabins.filter(c =>
      c.genre?.toLowerCase().includes(f) ||
      c.title?.toLowerCase().includes(f) ||
      c.sku?.toLowerCase().includes(f) ||
      c.productlink?.toLowerCase().includes(f)
    );
  }

  ngOnDestroy() {
    this._subUpdateOrderList.unsubscribe();
    this._subMarqueUpdateOrderList.unsubscribe();
    this._subGenderUpdateOrderList.unsubscribe();
    this._subGarmentOrderList.unsubscribe();
    this._subGetProduct.unsubscribe();
    this._subGetAllCabin.unsubscribe();
    this._subGetMarques.unsubscribe();
    this._subGetAllGarment.unsubscribe();
    this._subGetAllGender.unsubscribe();
    this._subDeleteCabin.unsubscribe();
    this._subDeleteProduct.unsubscribe();
    this._subDeleteMarque.unsubscribe();
    this._subDeleteGarment.unsubscribe();
    this._subDeleteGender.unsubscribe();
  }



}
