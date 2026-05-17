import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GarmentService } from '../../../services/garment.service';

@Component({
  selector: 'app-edit-garment',
  imports: [ReactiveFormsModule],
  templateUrl: './edit-garment.component.html',
  styleUrl: './edit-garment.component.scss',
})
export class EditGarmentComponent implements OnInit {

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private garmentService = inject(GarmentService);
  private router = inject(Router);

  id!: number;

  form = this.fb.group({
    name: ['']
  });

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    this.garmentService.getAll().subscribe(garments => {
      const garment = garments.find(g => Number(g.id) === this.id);

      console.log("garment trouvé =", garment);

      if (garment) {
        this.form.patchValue({
          name: garment.name
        });
      }
    });
  }

  submit() {
    const name = this.form.value.name ?? '';

    this.garmentService.updateGarment(this.id, name).subscribe(res => {
      console.log("update garment response", res);
      this.router.navigate(['/admin']);
    });
  }
}

