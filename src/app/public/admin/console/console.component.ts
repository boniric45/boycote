import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, effect, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { Garment } from '../../../models/garment';
import { Gender } from '../../../models/gender';
import { Marque } from '../../../models/marque';
import { Product } from '../../../models/product';
import { TruncatePipe } from "../../../pipes/truncate.pipe";
import { AuthService } from '../../../services/auth.service';
import { ConsoleProductService } from '../../../services/console-product.service';
import { GarmentService } from '../../../services/garment.service';
import { GenderService } from '../../../services/gender.service';
import { MarqueService } from '../../../services/marque.service';
import { CabineService } from '../../../services/cabine.service';
import { Cabin } from '../../../models/cabin';


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

  private router = inject(Router);
  private auth = inject(AuthService);
  private consoleProductService = inject(ConsoleProductService);
  private marqueService = inject(MarqueService);
  private garmentService = inject(GarmentService);
  private genderService = inject(GenderService);
  private cabinService = inject(CabineService);

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

  loadCabins(){
    this.cabinService.getAllCabin().subscribe( c =>{
      this.cabins = c;
    })
  }

  loadMarques() {
    this.marqueService.getMarques().subscribe(res => {
      const sorted = [...res].sort((a, b) => a.display_order - b.display_order);
      this.marques = res;
    });
  }

  loadGarments() {
    this.garmentService.getAll().subscribe(res => {
      const sorted = [...res].sort((a, b) => a.display_order - b.display_order);
      this.garments = res
    });
  }

  loadGenders() {
    this.genderService.getAll().subscribe(res => {
      const sorted = [...res].sort((a, b) => a.display_order - b.display_order);
      this.genders = res
    });
  }

  getPreviewProduct(product: Product): string {
    return product.pathpictureone || 'assets/no-image.png';
  }

  editProduct(product: Product) {
    this.consoleProductService.product = product;
    this.router.navigateByUrl('admin/update')
    console.log(product.id);
  }

  deleteProduct(id: number) {
    if (confirm('Supprimer le produit avec l\'id: ' + id + ' ?')) {

      this.consoleProductService.deleteProductById(id)
        .subscribe(() => {
          window.location.reload();
        });
    }
  }
  
  editCabin(cabin: any) {
    this.router.navigateByUrl('admin2/cabin/edit/'+cabin.id);
    console.log(cabin);
  }

  getPreviewCabin(cabin: Cabin): string {
    return cabin.picturecabin || 'assets/no-image.png';
  }

  deleteCabin(id: number) {
    if (confirm("Supprimer cette cabine ?")) {
      this.cabinService.deleteCabin(id).subscribe(() => {
          alert('Article Supprimé');
          this.loadCabins();
      });
    }
  }


  editMarque(marque: Marque) {
    this.router.navigateByUrl('admin/marque/edit/'+marque.id);
    console.log(marque.id);
  }
  

  deleteMarque(id: number) {
    if (!confirm("Supprimer cette marque ?")) return;

    this.marqueService.deleteMarque(id).subscribe(res => {
      console.log("delete response", res);
      this.loadMarques(); // recharge la liste
    });
  }

  editGarment(garment: Garment) {
    this.router.navigateByUrl('admin/garment/edit/'+garment.id)
    console.log(garment.id);
  }

  deleteGarment(id: number) {
    if (confirm('Supprimer le vêtement avec l\'id: ' + id + ' ?')) {
      this.garmentService.deleteGarment(id)
        .subscribe(() => {
          window.location.reload();
        });
    }
  }

  editGender(gender: Gender) {
    this.router.navigateByUrl('admin/gender/edit/'+gender.id)
    console.log(gender.id);
  }

  deleteGender(id: number) {
    if (confirm('Supprimer le genre avec l\'id: ' + id + ' ?')) {
      this.genderService.deleteGender(id)
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




}
