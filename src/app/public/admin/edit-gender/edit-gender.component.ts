import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GenderService } from '../../../services/gender.service';
import { Subscription } from 'rxjs';
import { ButtonReturnComponent } from '../../../shared/button-return/button-return.component';

@Component({
  selector: 'app-edit-gender',
  imports: [ReactiveFormsModule, ButtonReturnComponent],
  templateUrl: './edit-gender.component.html',
  styleUrl: './edit-gender.component.scss',
})
export class EditGenderComponent implements OnInit {

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private genderService = inject(GenderService);
  private _subGetAll = Subscription.EMPTY;
  private _subUpdateGender = Subscription.EMPTY;

  id!: number;

  form = this.fb.group({
    name: ['', Validators.required]
  });

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    this._subGetAll = this.genderService.getAll().subscribe(genders => {
      const gender = genders.find(g => Number(g.id) === this.id);

      if (gender) {
        this.form.patchValue({
          name: gender.name
        });
      }
    });
  }

  submit() {
    if (this.form.invalid) return;

    const name = this.form.value.name ?? '';

    this._subUpdateGender = this.genderService.updateGender(this.id, name).subscribe((res) => {
      this.router.navigate(['/console']);
    });
  }

  ngOnDestroy(){
    this._subGetAll.unsubscribe();
    this._subUpdateGender.unsubscribe();
  }
}