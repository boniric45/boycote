import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Marque } from '../../../models/marque';
import { Product } from '../../../models/product';
import { AuthService } from '../../../services/auth.service';
import { ConsoleProductService } from '../../../services/console-product.service';
import { MarqueService } from '../../../services/marque.service';
import { UploadService } from '../../../services/upload.service';
import { Garment } from '../../../models/garment';
import { Gender } from '../../../models/gender';
import { GarmentService } from '../../../services/garment.service';
import { GenderService } from '../../../services/gender.service';
import { Cabin } from '../../../models/cabin';
import { Subscription } from 'rxjs';


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
  private typeService = inject(GarmentService);
  private genderService = inject(GenderService);
  private snackBar = inject(MatSnackBar);
  private auth = inject(AuthService);

  marques: Marque[] = [];
  types: Garment[] = [];
  genders: Gender[] = [];
  product!: Product;
  cabin!: Cabin;
  id = 0;
  mode = '';
  refreshToken = Date.now(); // ou un compteur


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
  });

  private _subGetmarque = Subscription.EMPTY;
  private _subTypes = Subscription.EMPTY;
  private _subGenders = Subscription.EMPTY;
  private _subUpload = Subscription.EMPTY;
  private _subCreateProduct = Subscription.EMPTY;
  private _subUpdateProduct = Subscription.EMPTY;
  private _subDeleteImage = Subscription.EMPTY;

  constructor() {
    this._subGetmarque = this.marqueService.getMarques().subscribe(res => this.marques = res);
    this._subTypes = this.typeService.getAll().subscribe(res => this.types = res);
    this._subGenders = this.genderService.getAll().subscribe(res => this.genders = res);
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

    this._subUpload = this.uploadService.upload(formData).subscribe(res => {
      this.form.patchValue({ [field]: res.path });
      // RAFRAICHISSEMENT DE L IMAGE
      const newPath = res.path + '?v=' + Date.now();
      this.form.patchValue({ [field]: newPath });
    });

  }

  logout() {
    this.auth.logout();
  }


  /** Enregistrement produit */
  save() {
    const product = this.form.value as Product;

    if (product.id === 0) {
      this._subCreateProduct = this.consoleProductService.create(product).subscribe({
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
      this._subUpdateProduct = this.consoleProductService.update(product).subscribe({
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

  deleteProductImage(field: string) {
    if (!confirm("Supprimer définitivement cette image ?")) return;

    const id = Number(this.form.value.id);

    this._subDeleteImage = this.consoleProductService.deleteImage(id, field).subscribe({
      next: () => {
        this.form.patchValue({ [field]: '' }); // champ vidé dans le formulaire
        alert("✔ Image supprimée");
      },
      error: () => alert("❌ Erreur suppression image")
    });

    this.snackBar.open("✔ Image supprimée", "Fermer", {
      duration: 3000,
    });
  }

  ngOnDestroy() {
    this._subGetmarque.unsubscribe();
    this._subTypes.unsubscribe();
    this._subGenders.unsubscribe();
    this._subUpload.unsubscribe();
    this._subCreateProduct.unsubscribe();
    this._subUpdateProduct.unsubscribe();
    this._subDeleteImage.unsubscribe();
  }



}
