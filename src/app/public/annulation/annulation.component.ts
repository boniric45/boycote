import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CarouselService } from '../../services/carousel.service';
import { EmailService } from '../../services/email.service';

@Component({
  selector: 'app-annulation',
  imports: [CommonModule, FormsModule],
  templateUrl: './annulation.component.html',
  styleUrl: './annulation.component.scss',
})
export class AnnulationComponent {

  private carouselService = inject(CarouselService);
  private emailService = inject(EmailService);

  closeCart() {
    this.carouselService.setMode('standard');
  }

  emailDest = 'boycote@proton.me';

  // SIGNALS
  lang = signal<'en' | 'fr'>('en');
  submitted = signal(false);
  error = signal(false);

  form = signal({
    email: '',
    type: '',
    orderNumber: '',
    sku: '',
    reason: '',
    items: '',
    tagConfirmed: false
  });

  showCheckbox = computed(() => this.form().type !== 'cancel');

  isValid = computed(() => {
    const f = this.form();
    const base =
      f.email &&
      f.type &&
      f.orderNumber &&
      f.items; // seulement les champs obligatoires
    const checkOk = f.type === 'cancel' || f.tagConfirmed;
    return base && checkOk;
  });

  changerLangue() {
    this.lang.update(l => l === 'en' ? 'fr' : 'en');
  }

  updateForm(field: string, value: any) {
    this.form.update(f => ({ ...f, [field]: value }));
  }

  submit() {
    if (!this.isValid()) return;

    this.emailService.sendEmailAnnulation({ ...this.form(), emailDest: this.emailDest }).subscribe({
      next: () => { this.submitted.set(true); },
      error: () => { this.error.set(true); }
    });
  }

}
