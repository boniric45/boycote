import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MarqueService } from '../../../services/marque.service';

@Component({
  selector: 'app-add-marque',
  imports: [ReactiveFormsModule],
  templateUrl: './add-marque.component.html',
  styleUrl: './add-marque.component.scss',
})
export class AddMarqueComponent {

  private fb = inject(FormBuilder);
  private marqueService = inject(MarqueService);
  private router = inject(Router);

  form = this.fb.group({
    name: ['']
  });


submit() {
  const name = this.form.value.name ?? '';

  this.marqueService.addMarque(name).subscribe(res => {
    console.log(res);
    this.router.navigate(['/admin']);
  });
}

}

