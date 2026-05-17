import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GarmentService } from '../../../services/garment.service';

@Component({
  selector: 'app-add-garment',
  imports: [ReactiveFormsModule],
  templateUrl: './add-garment.component.html',
  styleUrl: './add-garment.component.scss',
})
export class AddGarmentComponent {

  private fb = inject(FormBuilder);
  private garmentService = inject(GarmentService);
  private router = inject(Router);

  form = this.fb.group({
    name: ['']
  });

  submit() {
    const name = this.form.value.name ?? '';

    this.garmentService.addGarment(name).subscribe(res => {
      console.log("add garment response", res);
      this.router.navigate(['/admin']);
    });
  }
}

