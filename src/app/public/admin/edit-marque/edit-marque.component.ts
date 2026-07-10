import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MarqueService } from '../../../services/marque.service';
import { Subscription } from 'rxjs';
import { ButtonReturnComponent } from '../../../shared/button-return/button-return.component';

@Component({
  selector: 'app-edit-marque',
  imports: [ReactiveFormsModule, ButtonReturnComponent],
  templateUrl: './edit-marque.component.html',
  styleUrl: './edit-marque.component.scss',
})
export class EditMarqueComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private marqueService = inject(MarqueService);
  private router = inject(Router);
  private _subGetMarques = Subscription.EMPTY;
  private _subUpdateMarque = Subscription.EMPTY;

  id!: number;

  form = this.fb.group({
    name: ['']
  });

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    this._subGetMarques = this.marqueService.getMarques().subscribe(marques => {
      const marque = marques.find(m => m.id === this.id);
      if (marque) {
        this.form.patchValue({ name: marque.name });
      }
    });
  }

  submit() {
    const name = this.form.value.name ?? '';

    this._subUpdateMarque = this.marqueService.updateMarque(this.id, name).subscribe(() => {
      this.router.navigate(['/console']);
    });
  }


  ngOnDestroy() {
    this._subGetMarques.unsubscribe();
    this._subUpdateMarque.unsubscribe();
  }
}

