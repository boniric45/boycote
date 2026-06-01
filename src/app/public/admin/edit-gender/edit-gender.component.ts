import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GenderService } from '../../../services/gender.service';

@Component({
  selector: 'app-edit-gender',
  imports: [ReactiveFormsModule],
  templateUrl: './edit-gender.component.html',
  styleUrl: './edit-gender.component.scss',
})
export class EditGenderComponent implements OnInit {

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private genderService = inject(GenderService);

  id!: number;

  form = this.fb.group({
    name: ['', Validators.required]
  });

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    this.genderService.getAll().subscribe(genders => {
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

    this.genderService.updateGender(this.id, name).subscribe((res) => {      
      this.router.navigate(['/admin']);
    });
  }
}