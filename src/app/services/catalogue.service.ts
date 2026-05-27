import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// ── Types ──────────────────────────────────────────────────────────────────
export type Genre     = 'homme' | 'femme';
export type Categorie = 'chapeau' | 'haut' | 'bas' | 'chaussures';

export interface Article {
  nom:       string;
  url:       string;
  imgSrc?:   string;   // base64 WebP
  imgTop?:   string;   // ex: "32.5%"
  imgLeft?:  string;
  imgWidth?: string;
  zIndex?:   number;
  shape?:    string;   // SVG inner HTML pour articles vectoriels
}

export interface Catalogue {
  homme: Record<Categorie, Article[]>;
  femme: Record<Categorie, Article[]>;
}

const CATALOGUE_VIDE: Catalogue = {
  homme: { chapeau: [], haut: [], bas: [], chaussures: [] },
  femme: { chapeau: [], haut: [], bas: [], chaussures: [] },
};

const LS_KEY = 'bc_catalogue_v1';

// ── Service ────────────────────────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class CatalogueService {

  // ⚠️  À modifier avec tes vraies URLs OVH
  private readonly API_GET  = '/api/catalogue-get.php';
  private readonly API_SAVE = '/api/catalogue-save.php';

  private readonly _catalogue = signal<Catalogue>(this.chargerLocal());

  /** Catalogue en lecture seule — utilisable dans les computed() */
  readonly catalogue = this._catalogue.asReadonly();

  constructor(private http: HttpClient) {
    this.chargerServeur();
  }

  // ── Lecture ──────────────────────────────────────────────────────────────

  articles(genre: Genre, cat: Categorie): Article[] {
    return this._catalogue()[genre][cat] ?? [];
  }

  // ── Mutations ────────────────────────────────────────────────────────────

  ajouter(genre: Genre, cat: Categorie, article: Article): void {
    const c = this.cloner();
    c[genre][cat] = [...c[genre][cat], article];
    this.appliquer(c);
  }

  supprimer(genre: Genre, cat: Categorie, index: number): void {
    const c = this.cloner();
    c[genre][cat] = c[genre][cat].filter((_, i) => i !== index);
    this.appliquer(c);
  }

  majPosition(
    genre: Genre, cat: Categorie, index: number,
    top: string, left: string, width: string
  ): void {
    const c = this.cloner();
    c[genre][cat][index] = {
      ...c[genre][cat][index],
      imgTop: top, imgLeft: left, imgWidth: width,
    };
    this.appliquer(c);
  }

  // ── Privé ─────────────────────────────────────────────────────────────────

  private cloner(): Catalogue {
    // Deep clone via JSON — safe car les données sont sérialisables
    return JSON.parse(JSON.stringify(this._catalogue()));
  }

  private appliquer(c: Catalogue): void {
    this._catalogue.set(c);
    // Sauvegarde locale immédiate (fallback si serveur indisponible)
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(c));
    } catch { /* quota dépassé — silencieux */ }
    // Sauvegarde serveur en arrière-plan
    this.sauverServeur(c);
  }

  private chargerLocal(): Catalogue {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Catalogue;
        // Vérification minimale de structure
        if (parsed?.homme && parsed?.femme) return parsed;
      }
    } catch { /* JSON invalide — silencieux */ }
    return JSON.parse(JSON.stringify(CATALOGUE_VIDE));
  }

  private chargerServeur(): void {
    this.http.get<Catalogue>(this.API_GET).subscribe({
      next: (data) => {
        if (data?.homme && data?.femme) {
          this._catalogue.set(data);
          try {
            localStorage.setItem(LS_KEY, JSON.stringify(data));
          } catch { /* silencieux */ }
        }
      },
      error: () => {
        // Fallback silencieux — localStorage déjà chargé dans chargerLocal()
      },
    });
  }

  private sauverServeur(c: Catalogue): void {
    this.http.post(this.API_SAVE, { catalogue: c }).subscribe({
      error: () => {
        // Silencieux — localStorage déjà sauvé dans appliquer()
      },
    });
  }
}
