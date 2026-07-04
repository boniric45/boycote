import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, HostListener, inject, Input, OnInit, signal, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Cabin } from '../../../models/cabin';
import { Garment } from '../../../models/garment';
import { CabineService } from '../../../services/cabine.service';
import { GarmentService } from '../../../services/garment.service';
import { UploadService } from '../../../services/upload.service';
import { CabinViewdragAddComponent } from "../cabin-viewdrag-add/cabin-viewdrag-add.component";
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product';

@Component({
  selector: 'app-cabin-add-form',
  imports: [ReactiveFormsModule, RouterLink, CommonModule, CabinViewdragAddComponent],
  templateUrl: './cabin-add-form.component.html',
  styleUrl: './cabin-add-form.component.scss',
})
export class CabinAddFormComponent implements OnInit {

  @ViewChild('canvas') canvas!: ElementRef;
  @Input() picture!: string;
  @Input() x!: number;
  @Input() y!: number;
  @Input() w!: number;
  @Input() h!: number;
  @Input() z!: number;

  private typeService = inject(GarmentService);
  private cabinService = inject(CabineService);
  private uploadService = inject(UploadService);
  private productService = inject(ProductService);

  productUpdateLink = signal<string>('');
  filteredProducts = signal<Product[]>([]);
  skuAlert = signal<string>('');


  cabin: Cabin | undefined;
  types: Garment[] = [];
  previewUrl: string | null = null;
  cabins: Cabin[] = [];
  cabinFiltered: any[] = [];
  products: Product[] = [];

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
  });

  private currentAction: 'move' | 'resize' | null = null;
  private startX: number = 0;
  private startY: number = 0;
  private startWPercent: number = 0;
  private startHPercent: number = 0;
  private startXPercent: number = 0;
  private startYPercent: number = 0;

  selectedCabin!: Cabin;

  ngOnInit() {

    this.typeService.getAll().subscribe(t => this.types = t);
    this.loadCabins();

    this.formCabin.controls.sku.valueChanges.subscribe(sku => {
      this.updateProductLink(sku);
      this.filterProducts(sku);
    });

    this.loadProducts();

  }

  deleteCabin(id: number) {
    if (confirm("Supprimer cette cabine ?")) {
      this.cabinService.deleteCabin(id).subscribe(res => {
        this.loadCabins(); // recharge la liste
      });
    }
  }

  loadProducts() {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
    });
  }

  filterProducts(term: string) {
    term = term.trim().toLowerCase();

    if (term.length < 2) {
      this.filteredProducts.set([]);
      this.skuAlert.set('');
      return;
    }

    const results = this.products.filter(p =>
      p.sku.toLowerCase().includes(term)
    );

    this.filteredProducts.set(results);

    if (results.length === 0) {
      this.skuAlert.set('⚠️ Aucun produit ne correspond à ce SKU, lien cabine non opérationnel');
    } else {
      this.skuAlert.set('');
    }
  }

  selectProduct(product: Product) {
    this.formCabin.controls.sku.setValue(product.sku);
    this.updateProductLink(product.sku);
    this.filteredProducts.set([]);
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
    let z = this.formCabin.controls.zindex.value;

    if (x < 0) x = 0;
    if (y < 0) y = 0;
    if (x > 100 - w) x = 100 - w; // Empêche de sortir par la droite
    if (y > 100 - h) y = 100 - h; // Empêche de sortir par le bas

    if (w < 5) w = 5;
    if (h < 5) h = 5;
    if (w > 100) w = 100;
    if (h > 100) h = 100;

    this.formCabin.patchValue({ positionx: x, positiony: y, width: w, height: h, zindex: z }, { emitEvent: false });
  }

  onFileSelectedCabin(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const sku = this.formCabin.controls.sku.value;


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

    // Upload l'image après la sélection de celle ci
    this.uploadService.uploadCabin(formData).subscribe({
      next: (res) => {
        console.log('Image uploadé : ', res.path);
        const pathPicture = res.path;
        this.formCabin.patchValue({ picturecabin: pathPicture });
        //  this.cdr.detectChanges();
        console.log(this.formCabin.value);

      },
      error: (err) => {
        console.log(err);
      }
    })

    // Remise à zéro de l'input pour autoriser les changements successifs instantanés
    input.value = '';
  }
  private cdr = inject(ChangeDetectorRef);

  saveCabin() {
    this.formCabin.patchValue({
      positionx: this.cabinService.x(),
      positiony: this.cabinService.y(),
      width: this.cabinService.w(),
      height: this.cabinService.h(),
      zindex: this.cabinService.z(),
      picturecabin: this.cabinService.picture()
    });

    const cabinData = this.formCabin.getRawValue();

    // On retire le ?t=... pour que la base de données stocke un chemin propre
    if (cabinData.picturecabin && cabinData.picturecabin.includes('?t=')) {
      cabinData.picturecabin = cabinData.picturecabin.split('?t=')[0];
    }

    console.log("2. Données propres envoyées à updateCabin :", cabinData);

    this.cabinService.createCabin(cabinData).subscribe({
      next: (res) => {
        console.log("3. Enregistrement réussi en base de données ! => ", res);

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Erreur lors de la mise à jour de la cabine :", err);
      }
    });
  }


  updateProductLink(sku: string) {


    const link = `/product/${sku}`;

    // Signal
    this.productUpdateLink.set(link);

    // Form
    this.formCabin.controls.productlink.setValue(link, { emitEvent: false });
  }

}
