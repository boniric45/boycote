import { CommonModule } from '@angular/common';
import { Component, Input, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Cabin } from '../../../models/cabin';

@Component({
  selector: 'app-previsualisation-cabin',
  imports: [CommonModule, RouterModule],
  templateUrl: './previsualisation-updatecabin.component.html',
  styleUrl: './previsualisation-updatecabin.component.scss',
})
export class PrevisualisationCabinComponent {

  readonly gender = signal<'MAN' | 'WOMAN'>('MAN');
  readonly mannequinImgHomme = 'pictures/mannequin-homme.webp';
  readonly mannequinImgFemme = 'pictures/mannequin-femme.webp';

    // Ton catalogue typé avec MAN/WOMAN
  catalogue: Record<'MAN' | 'WOMAN', Record<string, Cabin[]>> = {
    MAN: {},
    WOMAN: {}
  };

  @Input() cabin?:Cabin;

getStyle() {
  if (!this.cabin) return {};

  return {
    position: 'absolute',
    left: `${this.cabin.positionx}%`,
    top: `${this.cabin.positiony}%`,
    width: `${this.cabin.width}%`,
    height: `${this.cabin.height}%`,
    zIndex: this.cabin.zindex
  };
}

getFullImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;

  if (url.startsWith('http')) {
    return url;
  }

  return 'https://boycote.fr' + url;
}


  isHomme(): boolean {
    return this.gender() === 'MAN';
  }

  isFemme(): boolean {
    return this.gender() === 'WOMAN';
  }

    onGenderChange(event: Event): void {
    this.setGender((event.target as HTMLSelectElement).value);
  }

  setGender(g: string): void {
    this.gender.set(g as 'MAN' | 'WOMAN');
  }

}


