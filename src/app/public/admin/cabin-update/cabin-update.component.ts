import { ChangeDetectorRef, Component, ElementRef, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Cabin } from '../../../models/cabin';
import { Garment } from '../../../models/garment';
import { CabineService } from '../../../services/cabine.service';
import { GarmentService } from '../../../services/garment.service';
import { UploadService } from '../../../services/upload.service';
import { CabineComponent } from "../../cabine/cabine.component";

@Component({
  selector: 'app-cabin-update',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, CabineComponent],
  templateUrl: './cabin-update.component.html',
  styleUrl: './cabin-update.component.scss',
})
export class CabinUpdateComponent implements OnInit {
  @ViewChild('canvas') canvas!: ElementRef;

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
  private cdr = inject(ChangeDetectorRef);

  cabin: Cabin | undefined;
  types: Garment[] = [];
  previewUrl: string | null = null;
  cabins: Cabin[] = [];

  // Variables d'état pour les mouvements interactifs
  private currentAction: 'move' | 'resize' | null = null;
  private startX: number = 0;
  private startY: number = 0;
  private startWPercent: number = 0;
  private startHPercent: number = 0;
  private startXPercent: number = 0;
  private startYPercent: number = 0;

ngOnInit(): void {
  this.typeService.getAll().subscribe(t => this.types = t);
  const id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
  
  if (id) {
    this.cabinService.getCabinById(id).subscribe(cabin => {
      if (cabin) {
        // 1️⃣ Correction du chemin d'image si nécessaire
        // Si ton application tourne sur http://localhost:4200 et que le dossier pictures est à la racine de l'API :
        // Tu peux concaténer l'URL de ton API ici si nécessaire (ex: `http://localhost:3000${cabin.picturecabin}`)
        
        this.formCabin.patchValue(cabin);

        // 2️⃣ Sécurité anti-débordement pour ramener l'image dans le cadre au chargement
        let x = this.formCabin.controls.positionx.value;
        let y = this.formCabin.controls.positiony.value;
        let w = this.formCabin.controls.width.value;
        let h = this.formCabin.controls.height.value;

        if (x > 100 || x < 0) x = 25; // Réajustement automatique au centre
        if (y > 100 || y < 0) y = 25;
        if (w <= 0 || w > 100) w = 55;
        if (h <= 0 || h > 100) h = 50;

        this.formCabin.patchValue({
          positionx: x,
          positiony: y,
          width: w,
          height: h
        });
      }
    });
  }
}

  // --- LOGIQUE INTERACTIVE : DRAG & RESIZE ---
  startDrag(event: MouseEvent, action: 'move' | 'resize') {
    event.preventDefault();
    event.stopPropagation();

    this.currentAction = action;
    this.startX = event.clientX;
    this.startY = event.clientY;

    this.startXPercent = this.formCabin.controls.positionx.value;
    this.startYPercent = this.formCabin.controls.positiony.value;
    this.startWPercent = this.formCabin.controls.width.value;
    this.startHPercent = this.formCabin.controls.height.value;
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.currentAction || !this.canvas) return;

    const canvasEl = this.canvas.nativeElement;
    const canvasWidth = canvasEl.clientWidth;
    const canvasHeight = canvasEl.clientHeight;

    // Transformation du delta pixel en ratio pourcentage (%)
    const deltaXPercent = ((event.clientX - this.startX) / canvasWidth) * 100;
    const deltaYPercent = ((event.clientY - this.startY) / canvasHeight) * 100;

    if (this.currentAction === 'move') {
      this.formCabin.patchValue({
        positionx: Math.round(this.startXPercent + deltaXPercent),
        positiony: Math.round(this.startYPercent + deltaYPercent)
      });
    } else if (this.currentAction === 'resize') {
      this.formCabin.patchValue({
        width: Math.max(5, Math.round(this.startWPercent + deltaXPercent)),
        height: Math.max(5, Math.round(this.startHPercent + deltaYPercent))
      });
    }

    this.validateBounds();
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    this.currentAction = null;
  }

  validateBounds() {
    let x = this.formCabin.controls.positionx.value;
    let y = this.formCabin.controls.positiony.value;
    let w = this.formCabin.controls.width.value;
    let h = this.formCabin.controls.height.value;

    if (x < 0) x = 0;
    if (y < 0) y = 0;
    if (x > 100 - w) x = 100 - w; // Empêche de sortir par la droite
    if (y > 100 - h) y = 100 - h; // Empêche de sortir par le bas
    
    if (w < 5) w = 5;
    if (h < 5) h = 5;
    if (w > 100) w = 100;
    if (h > 100) h = 100;

    this.formCabin.patchValue({ positionx: x, positiony: y, width: w, height: h }, { emitEvent: false });
  }
  // --------------------------------------------

onFileSelectedCabin(event: Event) {
  const input = event.target as HTMLInputElement;
  
  if (!input.files || input.files.length === 0) return;

  const file = input.files[0];
  const sku = this.formCabin.controls.sku.value;

  if (!sku || sku.trim() === '') {
    alert("Veuillez saisir un SKU avant l'upload");
    input.value = '';
    return;      
  }

  // 1️⃣ SÉCURITÉ : Si une URL Blob locale existait déjà, on la libère pour vider la mémoire
  const previousUrl = this.formCabin.controls.picturecabin.value;
  if (previousUrl && previousUrl.startsWith('blob:')) {
    URL.revokeObjectURL(previousUrl);
  }

  // 2️⃣ GÉNÉRATION DE L'APERÇU LOCAL IMMÉDIAT
  const localPreviewUrl = URL.createObjectURL(file);
  
  const currentWidth = this.formCabin.controls.width.value || 30;
  const currentHeight = this.formCabin.controls.height.value || 30;

  this.formCabin.patchValue({ 
    picturecabin: localPreviewUrl,
    width: currentWidth,
    height: currentHeight
  });

  this.cdr.detectChanges();

  // 3️⃣ ENVOI AU SERVEUR
  const formData = new FormData();
  formData.append('file', file);
  formData.append('sku', sku);
  formData.append('index', 'cabine');

  this.uploadService.uploadCabin(formData).subscribe({
    next: (res) => {
      if (res && res.path) {
        // res.path contient ce que ton API PHP renvoie (ex: "uploads/cabine/TEST1.png")
        
        // On y ajoute le timestamp pour forcer le navigateur à rafraîchir l'image à droite
        const timestampUrl = `${res.path}?t=${new Date().getTime()}`;
        
        this.formCabin.patchValue({ picturecabin: timestampUrl });
        this.cdr.detectChanges();
        
        console.log("1. Image uploadée et rafraîchie à droite :", timestampUrl);
      }
    },
    error: (err) => {
      console.error("Erreur lors de l'appel à uploadCabin :", err);
    }
  });

  // Remise à zéro de l'input pour autoriser les changements successifs instantanés
  input.value = '';
}

saveCabin() {
  const cabinData = this.formCabin.getRawValue();

  // On retire le ?t=... pour que la base de données stocke un chemin propre
  if (cabinData.picturecabin && cabinData.picturecabin.includes('?t=')) {
    cabinData.picturecabin = cabinData.picturecabin.split('?t=')[0];
  }

  console.log("2. Données propres envoyées à updateCabin :", cabinData);

  this.cabinService.updateCabin(cabinData).subscribe({
    next: (res) => {
      console.log("3. Enregistrement réussi en base de données !");
      alert("La cabine a été enregistrée avec succès !");

      // On reset le formulaire SEULEMENT maintenant que la base est à jour
      this.formCabin.reset({
        id: 0, sku: '', title: '', genre: '', type: '',
        picturecabin: '', positionx: 0, positiony: 0,
        width: 0, height: 0, zindex: 0, productlink: '', displayorder: 0
      });
      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error("Erreur lors de la mise à jour de la cabine :", err);
    }
  });
}
}