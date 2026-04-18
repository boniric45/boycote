import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Marque } from '../../../models/marque';
import { Product } from '../../../models/product';
import { ConsoleProductService } from '../../../services/console-product.service';
import { MarqueService } from '../../../services/marque.service';
import { UploadService } from '../../../services/upload.service';

@Component({
  selector: 'app-product-form',
  imports: [CommonModule,ReactiveFormsModule,RouterLink],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
})
export class ProductFormComponent {

  private productService = inject(ConsoleProductService);
  private uploadService = inject(UploadService);
  private marqueService = inject(MarqueService);
  private route = inject(Router);
  marques: Marque[] = [];
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

  getPictureField(i: number):string {
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

  /** Formulaire complet */
  form = new FormGroup({
    id: new FormControl(0),
    sku: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    name: new FormControl('',{ nonNullable: true, validators: [Validators.required] }),
    description: new FormControl(''),
    conditions: new FormControl(''),
    marque: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    type: new FormControl('',{ nonNullable: true, validators: [Validators.required] }),
    gender: new FormControl('',{ nonNullable: true, validators: [Validators.required] }),
    size: new FormControl('',{ nonNullable: true, validators: [Validators.required] }),
    mesure: new FormControl('',{ nonNullable: true, validators: [Validators.required] }),
    prix: new FormControl(0,{ nonNullable: true, validators: [Validators.required] }),
    stock: new FormControl(0,{ nonNullable: true, validators: [Validators.required] }),

    pathpictureone: new FormControl('',{ nonNullable: true, validators: [Validators.required] }),
    pathpicturetwo: new FormControl(''),
    pathpicturethree: new FormControl(''),
    pathpicturefour: new FormControl(''),
    pathpicturefive: new FormControl(''),
    pathpicturesix: new FormControl(''),
    pathpictureseven: new FormControl(''),
    pathpictureeight: new FormControl(''),
    pathpicturenine: new FormControl(''),
    pathpictureten: new FormControl(''),

    pictureCabine: new FormControl(''),
    productLink: new FormControl(''),
    titleProductCabine: new FormControl(''),
    zindexcabine: new FormControl(''),
    xcabine: new FormControl(0),
    ycabine: new FormControl(0),
    widthCabine: new FormControl(0),
    heightCabine: new FormControl(0)
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



/** Enregistrement produit */
save() {
  const product = this.form.value as Product;

  if (product.id === 0) {
    this.productService.create(product).subscribe({
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
    this.productService.update(product).subscribe({
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


