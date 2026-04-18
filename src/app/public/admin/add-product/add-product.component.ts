import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { AddProductResponse } from '../../models/product';


@Component({
  selector: 'app-add-product',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss',
})

export class AddProductComponent {



  form!: FormGroup; // déclaration sans initialisation

  constructor(
    private fb: FormBuilder,
    private productService: ProductService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      codeEan: [''],
      idImage: [null, Validators.required],
      description: [''],
      marque: [''],
      type: [''],
      gender: [''],
      size: [''],
      quantity: [0],
      ht: [0, Validators.required],
      tva: [20],
      ttc: [{ value: 0, disabled: true }],
      stock: [0],
      pathPictureOne: [''],
      pathPictureTwo: [''],
      pathPictureThree: [''],
      pathPictureFour: [''],
      pathPictureFive: ['']
    });
  }


  updateTTC() {
    const ht = this.form.get('ht')?.value ?? 0;
    const tva = this.form.get('tva')?.value ?? 0;
    const ttc = ht + (ht * (tva / 100));
    this.form.get('ttc')?.setValue(Number(ttc.toFixed(2)), { emitEvent: false });
  }

  submit() {
    if (this.form.invalid) return;
      this.updateTTC(); // obligatoire
      const product = this.form.getRawValue();
    
  this.productService.addProduct(product).subscribe({
  next: (res: AddProductResponse) => {
    alert('Produit ajouté avec succès ! ID : ' + res.id);
    this.form.reset();
  },
  error: () => alert('Erreur lors de l’ajout du produit')
});

  }

}
