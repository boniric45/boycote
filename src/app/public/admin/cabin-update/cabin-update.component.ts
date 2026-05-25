import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CabineService } from '../../../services/cabine.service';
import { GarmentService } from '../../../services/garment.service';
import { UploadService } from '../../../services/upload.service';
import { Cabin } from '../../../models/cabin';
import { Garment } from '../../../models/garment';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-cabin-update',
  imports: [ReactiveFormsModule,RouterLink,CommonModule],
  templateUrl: './cabin-update.component.html',
  styleUrl: './cabin-update.component.scss',
})
export class CabinUpdateComponent implements OnInit {

  formCabin = new FormGroup({
    id: new FormControl(0, { nonNullable: true }),
    sku: new FormControl('', { nonNullable: true }),
    idproduct: new FormControl(0, { nonNullable: true }),
    picturecabin: new FormControl('', { nonNullable: true }),
    title: new FormControl('', { nonNullable: true }),
    productlink: new FormControl('', { nonNullable: true }),
    positionx: new FormControl(0, { nonNullable: true }),
    positiony: new FormControl(0, { nonNullable: true }),
    zindex: new FormControl(0, { nonNullable: true }),
    width: new FormControl(0, { nonNullable: true }),
    height: new FormControl(0, { nonNullable: true }),
    type: new FormControl('', { nonNullable: true }),
    genre: new FormControl('', { nonNullable: true }),
    displayorder: new FormControl(0, { nonNullable: true })
  });

  private typeService = inject(GarmentService);
  private cabinService = inject(CabineService);
  private uploadService = inject(UploadService);
  private activatedRoute = inject(ActivatedRoute);

    cabin: Cabin | undefined;
    types: Garment[] = [];
    previewUrl: string | null = null;
    cabins: Cabin[] = [];
  
  ngOnInit(): void {
    this.typeService.getAll().subscribe( t => this.types = t);
    const id = Number(this.activatedRoute.snapshot.paramMap.get('id')); // Récupère l'id de l'appelant
    if (id) {
      this.cabinService.getCabinById(id).subscribe(cabin => {
        this.formCabin.patchValue(cabin);
      });
    }
  }


  onFileSelectedCabin(event: any) {
    const file = event.target.files[0];
    const sku = this.formCabin.value.sku;

    if (!file) return;
    if (!sku || sku.trim() === '') {
      alert("Veuillez saisir un SKU avant l'upload");
      return;
    }

    // ✅ Preview immédiate
    const previewUrl = URL.createObjectURL(file);
    this.formCabin.patchValue({ picturecabin: previewUrl });

    // ✅ Upload backend
    const formData = new FormData();
    formData.append('file', file);
    formData.append('sku', String(sku));
    formData.append('index', 'cabine');

    this.uploadService.uploadCabin(formData).subscribe(res => {
      this.formCabin.patchValue({ picturecabin: res.path });
    });
  }


  saveCabin() {

      const cabin = this.formCabin.getRawValue();

      // ➕ Create
      this.cabinService.updateCabin(cabin).subscribe(res => {
        console.log("Cabine modifié:", res);
      });
    

    // Reset Formulaire
    this.formCabin.reset({
    sku: '',
    title: '',
    genre: '',
    type: '',
    picturecabin: '',
    positionx: 0,
    positiony: 0,
    width: 0,
    height: 0,
    zindex: 0,
    productlink: '',
    displayorder: 0
  });

  }


}
