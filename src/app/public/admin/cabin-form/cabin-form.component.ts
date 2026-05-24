import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Cabin } from '../../../models/cabin';
import { Garment } from '../../../models/garment';
import { CabineService } from '../../../services/cabine.service';
import { GarmentService } from '../../../services/garment.service';
import { UploadService } from '../../../services/upload.service';

@Component({
  selector: 'app-cabin-form',
  imports: [ReactiveFormsModule,RouterLink,CommonModule],
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
  editMode: boolean = false;
  cabins: Cabin[] = [];
  cabinFiltered: any[] = [];

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

  ngOnInit() {

    effect(() => {
      const cabin = this.cabinService.selectedCabin();
      console.log('Cabin Form> ', cabin);
      if (cabin) {
        this.formCabin.patchValue(cabin);
        this.editMode = true;
      }
    });
    this.typeService.getAll().subscribe( t => this.types = t);
    this.loadCabins();
      // s'abonne au signal NE FONCTIONNE PAS

        // écoute du signal pour le refresh
      effect(() => {
        const refresh = this.cabinService.refreshTrigger();
        if (refresh !== null) {
          this.loadCabins(); // recharge la liste
        }
      });
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
  // const cabin = this.formCabin.getRawValue();
  // this.cabinService.createCabin(cabin).subscribe(res => {
  // });
    console.log("saveCabin déclenché, editMode=", this.editMode);
    const cabin = this.formCabin.getRawValue();
      console.log("Cabin envoyé:", cabin);

  if (this.editMode) {
    // 🔄 Update
    this.cabinService.updateCabin(cabin).subscribe(res => {
      console.log("Cabine mise à jour:", res);
      this.editMode = false;
      this.loadCabins(); // recharge la liste
    });
  } else {
    // ➕ Create
    this.cabinService.createCabin(cabin).subscribe(res => {
      console.log("Cabine créée:", res);
      this.loadCabins();
    });
  }

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

deleteCabin(id: number) {
  if (confirm("Supprimer cette cabine ?")) {
    this.cabinService.deleteCabin(id).subscribe(res => {
      console.log("Cabine supprimée:", res);
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
      console.log("editMode activé:", this.editMode);
  this.formCabin.patchValue(cabin);
  this.editMode = true;

}

}
