import { Injectable, signal } from '@angular/core';
import { Genre, Categorie } from './catalogue.service';

export interface EtatPlacement {
  actif:     boolean;
  src:       string;
  genre:     Genre;
  categorie: Categorie;
  nom:       string;
  url:       string;
  zIndex:    number;
  x:      number;
  y:      number;
  w:      number;
  slider: number;
}

const DEFAUT: EtatPlacement = {
  actif: false, src: '', genre: 'homme', categorie: 'haut',
  nom: '', url: '#', zIndex: 3, x: 0, y: 0, w: 0, slider: 100,
};

@Injectable({ providedIn: 'root' })
export class PlacementService {

  private readonly _etat = signal<EtatPlacement>({ ...DEFAUT });
  readonly etat = this._etat.asReadonly();

  ouvrir(params: {
    src: string; genre: Genre; categorie: Categorie;
    nom: string; url: string; zIndex: number;
    mcWidth: number; mcHeight: number;
  }): void {
    this._etat.set({
      actif:     true,
      src:       params.src,
      genre:     params.genre,
      categorie: params.categorie,
      nom:       params.nom,
      url:       params.url,
      zIndex:    params.zIndex,
      x:      0,
      y:      Math.round(params.mcHeight * 0.22),
      w:      params.mcWidth,
      slider: 100,
    });
  }


  setPosition(x: number, y: number): void {
    this._etat.update(s => ({ ...s, x, y }));
  }

  setLargeur(w: number, mcWidth: number): void {
    const slider = Math.min(400, Math.max(5, Math.round(w / mcWidth * 100)));
    this._etat.update(s => ({ ...s, w, slider }));
  }

  setSlider(val: number, mcWidth: number): void {
    const w = Math.round(mcWidth * val / 100);
    this._etat.update(s => ({ ...s, w, slider: val }));
  }

  annuler(): void {
    this._etat.set({ ...DEFAUT });
  }

  getPourcentages(mcWidth: number, mcHeight: number) {
    const s = this._etat();
    return {
      top:   (s.y / mcHeight * 100).toFixed(1) + '%',
      left:  (s.x / mcWidth  * 100).toFixed(1) + '%',
      width: (s.w / mcWidth  * 100).toFixed(1) + '%',
    };
  }
}
