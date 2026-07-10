import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GenderService } from '../../../services/gender.service';
import { Subscription } from 'rxjs';
import { ButtonReturnComponent } from '../../../shared/button-return/button-return.component';

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
  private _subGender = Subscription.EMPTY;

  form = this.fb.group({
    name: ['', Validators.required]
  });

  submit() {
    if (this.form.invalid) return;

    const name = this.form.value.name ?? '';

    this._subGender = this.genderService.addGender(name).subscribe(res => {
      this.router.navigate(['/admin']);
    });
  }

  ngOnDestroy(){
    this._subGender.unsubscribe();
  }
}
