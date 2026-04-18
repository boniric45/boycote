import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Marque } from '../../../models/marque';
import { Product } from '../../../models/product';
import { AuthService } from '../../../services/auth.service';
import { ConsoleProductService } from '../../../services/console-product.service';
import { MarqueService } from '../../../services/marque.service';
import { UploadService } from '../../../services/upload.service';

@Component({
  selector: 'app-product-update',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './product-update.component.html',
  styleUrl: './product-update.component.scss',
})
export class ProductUpdateComponent implements OnInit {

  private consoleProductService = inject(ConsoleProductService);
  //private productService = inject(ProductService);
  private uploadService = inject(UploadService);
  private marqueService = inject(MarqueService);
  private auth = inject(AuthService);
  //private route = inject(Router);
  marques: Marque[] = [];
  product!: Product;
  id = 0;
  mode = '';

  /** Mapping simple et fiable */
  pictureFields = [
    'pathpictureone',
    'pathpicturetwo',
    'pathpicturethree',
    'pathpicturefour',
    'pathpicturefive',
    'pathpicturesix',
    'pathpictureseven',
    'pathpictureeight',
    'pathpicturenine',
    'pathpictureten'
  ];

ngOnInit(): void {
  this.product = this.consoleProductService.product;

  if (!this.product) {
    console.error("Aucun produit trouvé dans le service");
    return;
  }

  // Patch du formulaire avec les données du produit
  this.form.patchValue(this.product);


  console.log("Produit chargé :", this.product);
}


  getPictureField(i: number): string {
    const fields = [
      'pathpictureone',
      'pathpicturetwo',
      'pathpicturethree',
      'pathpicturefour',
      'pathpicturefive',
      'pathpicturesix',
      'pathpictureseven',
      'pathpictureeight',
      'pathpicturenine',
      'pathpictureten'
    ];
    return this.pictureFields[i - 1];
  }

  form = new FormGroup({
    id: new FormControl(0),
    sku: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl(''),
    conditions: new FormControl(''),
    marque: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    type: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    gender: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    size: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    mesure: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    prix: new FormControl(0, { nonNullable: true, validators: [Validators.required] }),
    stock: new FormControl(0, { nonNullable: true, validators: [Validators.required] }),

    pathpictureone: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    pathpicturetwo: new FormControl(''),
    pathpicturethree: new FormControl(''),
    pathpicturefour: new FormControl(''),
    pathpicturefive: new FormControl(''),
    pathpicturesix: new FormControl(''),
    pathpictureseven: new FormControl(''),
    pathpictureeight: new FormControl(''),
    pathpicturenine: new FormControl(''),
    pathpictureten: new FormControl(''),

    // 🔥 Champs corrigés pour correspondre EXACTEMENT à ton backend
    picturecabine: new FormControl(''),
    productlink: new FormControl(''),
    titleproductcabine: new FormControl(''),
    zindexcabine: new FormControl(''),

    xcabine: new FormControl(0),
    ycabine: new FormControl(0),
    widthcabine: new FormControl(0),
    heightcabine: new FormControl(0)
  });

 
 
  constructor() {
    this.marqueService.getMarques().subscribe(res => this.marques = res);
  }


  /** Upload + preview automatique */
  onFileSelected(event: any, field: string, index: number | string) {
    const file = event.target.files[0];
    const marque = this.form.value.marque;
    const sku = this.form.value.sku;

    if (!marque || !sku) {
      alert("Veuillez remplir tous les champs avec une étoiles rouges.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('marque', marque);
    formData.append('sku', sku);
    formData.append('index', index.toString());

    this.uploadService.upload(formData).subscribe(res => {
      this.form.patchValue({ [field]: res.path });
    });

  }

  logout() {
    this.auth.logout();
  }


  /** Enregistrement produit */
  save() {
    const product = this.form.value as Product;
    console.log("ID envoyé :", product.id);
    if (product.id === 0) {
      this.consoleProductService.create(product).subscribe({
        next: (res) => {
          alert(`✔ ${res.message} (ID: ${res.id})`);
          // 🔥 Recharger la page après upload réussi
          window.location.reload();
        },
        error: (err) => {
          console.error(err);
          alert("❌ Erreur serveur lors de la création : " + (err.error?.error ?? "Erreur inconnue"));
        }
      });
    } else {
      this.consoleProductService.update(product).subscribe({
        next: (res) => {
          alert(`✔ ${res.message}`);
        },
        error: (err) => {
          console.error(err);
          alert("❌ Erreur serveur lors de la mise à jour : " + (err.error?.error ?? "Erreur inconnue"));
        }
      });
    }
  }






}
