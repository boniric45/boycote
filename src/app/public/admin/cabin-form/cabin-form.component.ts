import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Cabin } from '../../../models/cabin';
import { Garment } from '../../../models/garment';
import { CabineService } from '../../../services/cabine.service';
import { GarmentService } from '../../../services/garment.service';
import { UploadService } from '../../../services/upload.service';
import { CabinViewAddComponent } from "../cabin-view-add/cabin-view-add.component";
import { CabineComponent } from '../../cabine/cabine.component';

@Component({
  selector: 'app-cabin-form',
  imports: [ReactiveFormsModule, RouterLink, CommonModule, CabinViewAddComponent,CabineComponent],
  templateUrl: './cabin-form.component.html',
  styleUrl: './cabin-form.component.scss',
})
export class CabinFormComponent implements OnInit{

  private typeService = inject(GarmentService);
  private cabinService = inject(CabineService);
  private uploadService = inject(UploadService);

  cabin: Cabin | undefined;
  types: Garment[] = [];
  previewUrl: string | null = null;
  cabins: Cabin[] = [];
  cabinFiltered: any[] = [];

  formCabin = new FormGroup({
    id: new FormControl(0, { nonNullable: true }),
    sku: new FormControl('', { nonNullable: true }),
    idproduct: new FormControl(0, { nonNullable: true }),
    picturecabin: new FormControl('', { nonNullable: true }),
    title: new FormControl('', { nonNullable: true }),
    productlink: new FormControl('', { nonNullable: true }),
    positionx: new FormControl(50, { nonNullable: true }),
    positiony: new FormControl(50, { nonNullable: true }),
    zindex: new FormControl(10, { nonNullable: true }),
    width: new FormControl(50, { nonNullable: true }),
    height: new FormControl(50, { nonNullable: true }),
    type: new FormControl('', { nonNullable: true }),
    genre: new FormControl('', { nonNullable: true }),
    displayorder: new FormControl(0, { nonNullable: true })
  });

  ngOnInit() {
    this.typeService.getAll().subscribe( t => this.types = t);
    this.loadCabins();

  }

// Récupération du fichier
onFileSelectedCabin(event: any) {
  const file = event.target.files[0];
  const sku = this.formCabin.value.sku;

  if (!file) return;
  if (!sku || sku.trim() === '') {
    alert("Veuillez saisir un SKU avant l'upload");
    return;
  }

  // 1️⃣ Aperçu immédiat (blob)
  const previewUrl = URL.createObjectURL(file);
  this.formCabin.patchValue({ picturecabin: previewUrl });

  // 2️⃣ Upload backend
  const formData = new FormData();
  formData.append('file', file);
  formData.append('sku', String(sku));
  formData.append('index', 'cabine');

  this.uploadService.uploadCabin(formData).subscribe(res => {
    // 3️⃣ On remplace le blob par l’URL backend
    const finalUrl = `https://boycote.fr${res.path}`;
    this.formCabin.patchValue({ picturecabin: finalUrl });
  });
}


saveCabin() {

    const cabin = this.formCabin.getRawValue();

    // ➕ Create
    this.cabinService.createCabin(cabin).subscribe(res => {
      this.loadCabins();
    });
  



}

deleteCabin(id: number) {
  if (confirm("Supprimer cette cabine ?")) {
    this.cabinService.deleteCabin(id).subscribe(res => {
      this.loadCabins(); // recharge la liste
    });
  }
}

loadCabins() {
  this.cabinService.getAllCabin().subscribe(res => {
    this.cabins = res;
    this.cabinFiltered = res; // ou applique ton filtre
  });
}

editCabin(cabin: any) {
  this.formCabin.patchValue(cabin);
}

onUpdateFromChild(e: any) {
  this.formCabin.patchValue({
    positionx: e.x,
    positiony: e.y,
    width: e.w,
    height: e.h,
    zindex: e.z
  });
}




}
