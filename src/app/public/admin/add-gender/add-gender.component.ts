import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GenderService } from '../../../services/gender.service';
import { ButtonReturnComponent } from "../../features/button-return/button-return.component";

@Component({
  selector: 'app-add-gender',
  imports: [ReactiveFormsModule, ButtonReturnComponent],
  templateUrl: './add-gender.component.html',
  styleUrl: './add-gender.component.scss',
})
export class AddGenderComponent {

  private fb = inject(FormBuilder);
  private genderService = inject(GenderService);
  private router = inject(Router);

  form = this.fb.group({
    name: ['', Validators.required]
  });

  submit() {
    if (this.form.invalid) return;

    const name = this.form.value.name ?? '';

    this.genderService.addGender(name).subscribe(res => {
      this.router.navigate(['/admin']);
    });
  }
}
