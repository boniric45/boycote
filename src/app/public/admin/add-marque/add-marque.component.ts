import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MarqueService } from '../../../services/marque.service';
import { Subscription } from 'rxjs';
import { ButtonReturnComponent } from '../../../shared/button-return/button-return.component';

@Component({
  selector: 'app-add-marque',
  imports: [ReactiveFormsModule, ButtonReturnComponent],
  templateUrl: './add-marque.component.html',
  styleUrl: './add-marque.component.scss',
})
export class AddMarqueComponent {

  private fb = inject(FormBuilder);
  private marqueService = inject(MarqueService);
  private router = inject(Router);
  private _subMarque = Subscription.EMPTY;

  form = this.fb.group({
    name: ['']
  });


submit() {
  const name = this.form.value.name ?? '';
    this._subMarque = this.marqueService.addMarque(name).subscribe(res => {
    this.router.navigate(['/admin']);
  });
}

ngOnDestroy(){
  this._subMarque.unsubscribe();
}

}

