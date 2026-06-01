import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Marque } from '../../../models/marque';
import { Product } from '../../../models/product';
import { ConsoleProductService } from '../../../services/console-product.service';
import { MarqueService } from '../../../services/marque.service';
import { UploadService } from '../../../services/upload.service';
import { GarmentService } from '../../../services/garment.service';
import { Garment } from '../../../models/garment';
import { GenderService } from '../../../services/gender.service';
import { Gender } from '../../../models/gender';
import { CabineService } from '../../../services/cabine.service';
import { Cabin } from '../../../models/cabin';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-product-form',
  imports: [CommonModule,ReactiveFormsModule,RouterLink],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
})
export class ProductFormComponent {

  private consoleService = inject(ConsoleProductService);
  private productService = inject(ProductService);
  private uploadService = inject(UploadService);
  private marqueService = inject(MarqueService);
  private typeService = inject(GarmentService);
  private genderService = inject(GenderService);
  private route = inject(Router);
  private cabinService = inject(CabineService);
  marques: Marque[] = [];
  types: Garment[] = [];
  genders: Gender[] = [];
  cabin!: Cabin;
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
    pathpictureten: new FormControl('')
  });


  formCabin = new FormGroup({
    id: new FormControl(0),
    sku: new FormControl(''),
    idproduct: new FormControl(0),
    picturecabin: new FormControl(''),
    title: new FormControl(''),
    productlink: new FormControl(''),
    positionx: new FormControl(0),
    positiony: new FormControl(0),
    zindex: new FormControl(0),
    width: new FormControl(0),
    height: new FormControl(0),
    type: new FormControl(''),
    genre: new FormControl('', { nonNullable: true }),
    displayorder: new FormControl(0)
  });

  constructor() {
    this.marqueService.getMarques().subscribe(res => this.marques = res);
    this.typeService.getAll().subscribe(res => this.types = res);
    this.genderService.getAll().subscribe(res => this.genders = res);
  }

onFileSelectedProduct(event: any, field: string, index: number | string) {
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

onFileSelectedCabin(event: any, field: string) {
  const file = event.target.files[0];
  const sku = this.formCabin.value.sku;


  const formData = new FormData();
  formData.append('file', file);
  // formData.append('sku', sku);
  formData.append('index', 'cabine');


  this.uploadService.uploadCabin(formData).subscribe(res => {
    // ✅ Patch le chemin du fichier dans le formCabin
    this.formCabin.patchValue({ [field]: res.path });
  });
}




/** Enregistrement produit */
saveProduct() {
  const product = this.form.value as Product;

  if (product.id === 0) {
    this.consoleService.create(product).subscribe({
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
    this.consoleService.update(product).subscribe({
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


saveCabin() {

  const sku = this.formCabin.value.sku;
  if (!sku) {
    alert("❌ SKU manquant");
    return;
  }

  // Patch toujours le SKU saisi
  this.formCabin.patchValue({ sku: sku });

  // Charger les produits pour chercher l'ID
  this.productService.loadProducts().subscribe(products => {
    const product = products.find(p => p.sku === sku);
    const idProduct = product ? product.id : 0;
    this.formCabin.patchValue({ idproduct: idProduct });

    // ✅ Récupère toutes les valeurs du formulaire
    const cabin = this.formCabin.getRawValue() as Cabin;

    // ✅ Envoie uniquement les infos cabine (pas de fichier)
    this.cabinService.createCabin(cabin).subscribe(res => {
    });
  });
}





  
}


