import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MarqueService } from '../../../services/marque.service';

@Component({
  selector: 'app-edit-marque',
  imports: [ReactiveFormsModule],
  templateUrl: './edit-marque.component.html',
  styleUrl: './edit-marque.component.scss',
})
export class EditMarqueComponent implements OnInit {
 private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private marqueService = inject(MarqueService);
  private router = inject(Router);

  id!: number;

  form = this.fb.group({
    name: ['']
  });

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    this.marqueService.getMarques().subscribe(marques => {
      const marque = marques.find(m => m.id === this.id);
      if (marque) {
        this.form.patchValue({ name: marque.name });
        console.log("marque trouvée =", marque);
      }
    });



  }

  submit() {
    const name = this.form.value.name ?? '';

    this.marqueService.updateMarque(this.id, name).subscribe(() => {
      this.router.navigate(['/admin']);
    });
  }
 
}

