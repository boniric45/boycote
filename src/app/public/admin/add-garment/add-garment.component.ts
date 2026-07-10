import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GarmentService } from '../../../services/garment.service';
import { Subscription } from 'rxjs';
import { ButtonReturnComponent } from '../../../shared/button-return/button-return.component';

@Component({
  selector: 'app-add-garment',
  imports: [ReactiveFormsModule, ButtonReturnComponent],
  templateUrl: './add-garment.component.html',
  styleUrl: './add-garment.component.scss',
})
export class AddGarmentComponent {

  private fb = inject(FormBuilder);
  private garmentService = inject(GarmentService);
  private router = inject(Router);
  private _subGarment = Subscription.EMPTY;

  form = this.fb.group({
    name: ['']
  });

  submit() {
    const name = this.form.value.name ?? '';

    this._subGarment = this.garmentService.addGarment(name).subscribe(res => {
      this.router.navigate(['/admin']);
    });
  }

  ngOnDestroy(){
    this._subGarment.unsubscribe();
  }
}

