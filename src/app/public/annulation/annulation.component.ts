import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-annulation',
  imports: [CommonModule,FormsModule],
  templateUrl: './annulation.component.html',
  styleUrl: './annulation.component.scss',
})
export class AnnulationComponent {


// ✏️ TON EMAIL PRO ICI
  emailDest = 'pagnon3105@gmail.com';

  private http = inject(HttpClient);

  // SIGNALS
  lang = signal<'en' | 'fr'>('en');
  submitted = signal(false);
  error = signal(false);

  form = signal({
    type: '',
    orderNumber: '',
    email: '',
    items: '',
    reason: '',
    tagConfirmed: false
  });

  showCheckbox = computed(() => this.form().type !== 'cancel');

  isValid = computed(() => {
    const f = this.form();
    const base = f.type && f.orderNumber && f.email && f.items;
    const checkOk = f.type === 'cancel' || f.tagConfirmed;
    return base && checkOk;
  });

  changerLangue() {
    this.lang.update(l => l === 'en' ? 'fr' : 'en');
  }

  updateForm(field: string, value: any) {
    this.form.update(f => ({ ...f, [field]: value }));
  }

  // ✏️ Ton dev remplace l'URL par celle de son API PHP OVH
  // Exemple : 'https://tonsite.com/api/send-return.php'
  submit() {
    if (!this.isValid()) return;

    this.http.post(
      'https://www.boycoté.fr/api/return.php',
      { ...this.form(), emailDest: this.emailDest }
    ).subscribe({
      next: () => { this.submitted.set(true); },
      error: () => { this.error.set(true); }
    });
  }




  

}
