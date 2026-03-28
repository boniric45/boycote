import { Component, signal } from '@angular/core';
import { SafeHtmlPipe } from '../../pipes/safe-html.pipe';
import { RouterModule } from '@angular/router';

type Cat = 'chapeau' | 'haut' | 'bas' | 'chaussures';

interface VetementItem {
  nom: string;
  url: string;
  zIndex: number;
  // Pour les SVG de test
  shape?: string;
  // Pour les vraies photos PNG détourrées
  imgSrc?: string;
  // Position et taille du calque image sur le mannequin (en % de la zone mannequin)
  imgTop?: string;
  imgLeft?: string;
  imgWidth?: string;
}

@Component({
  selector: 'app-cabine',
  imports: [SafeHtmlPipe,RouterModule],
  templateUrl: './cabine.component.html',
  styleUrl: './cabine.component.scss',
})
export class CabineComponent {

   readonly cats: Cat[] = ['chapeau', 'haut', 'bas', 'chaussures'];
  readonly gender  = signal<'homme' | 'femme'>('homme');
  readonly indexes = signal<Record<Cat, number>>({ chapeau: -1, haut: -1, bas: -1, chaussures: -1 });

  // Photo mannequin — remplace les chemins par tes vraies images
  readonly mannequinImgHomme = 'assets/mannequin-homme.png'; // <-- ta photo homme
  readonly mannequinImgFemme = 'assets/mannequin-femme.png'; // <-- ta photo femme

  readonly catalogue: Record<string, Record<Cat, VetementItem[]>> = {
    homme: {
      chapeau: [
        {
          nom: 'John Rocha Beige Cap', url: '/produits/casquette-rocha', zIndex: 5,
          // Mode SVG (test) — à remplacer par imgSrc quand tu as les vraies photos
          shape: `<ellipse cx="80" cy="23" rx="33" ry="11" fill="#d4b896"/><rect x="47" y="21" width="66" height="8" rx="2" fill="#c4a882"/>`,
          // Mode image (production) — décommente et remplis quand tu as les photos
          // imgSrc: 'assets/vetements/homme/chapeau-rocha.png',
          // imgTop: '0%', imgLeft: '20%', imgWidth: '60%'
        },
        {
          nom: 'Navy Bucket Hat', url: '/produits/bob-marine', zIndex: 5,
          shape: `<ellipse cx="80" cy="19" rx="31" ry="14" fill="#2c3e6b"/><ellipse cx="80" cy="23" rx="40" ry="7" fill="#1e2e5a"/>`,
        },
        {
          nom: 'Grey Marl Beanie', url: '/produits/bonnet-gris', zIndex: 5,
          shape: `<path d="M53 28 Q53 6 80 6 Q107 6 107 28 L103 32 L57 32Z" fill="#888"/><rect x="51" y="30" width="58" height="7" rx="4" fill="#777"/>`,
        },
      ],
      haut: [
        {
          nom: 'Prada 2007 Blue Jacket', url: '/produits/veste-prada-bleu', zIndex: 3,
          shape: `<path d="M46 82 Q33 90 32 118 L32 200 L63 204 L63 94 L80 90 L97 94 L97 204 L128 200 L128 118 Q127 90 114 82 Q98 76 80 76 Q62 76 46 82Z" fill="#2a4a7f"/><path d="M63 94 L63 204 L97 204 L97 94 L80 90Z" fill="#1e3a6e"/>`,
        },
        {
          nom: 'White Oxford Shirt', url: '/produits/chemise-blanche', zIndex: 3,
          shape: `<path d="M46 82 Q33 90 32 118 L32 200 L63 204 L63 94 L80 90 L97 94 L97 204 L128 200 L128 118 Q127 90 114 82 Q98 76 80 76 Q62 76 46 82Z" fill="#eeebe5"/><path d="M80 76 L80 204" stroke="#ccc" stroke-width="1.2" fill="none"/>`,
        },
        {
          nom: 'Camel Turtleneck Sweater', url: '/produits/pull-camel', zIndex: 3,
          shape: `<path d="M46 82 Q33 90 32 118 L32 200 L63 204 L63 94 L80 90 L97 94 L97 204 L128 200 L128 118 Q127 90 114 82 Q98 76 80 76 Q62 76 46 82Z" fill="#c4956a"/><ellipse cx="80" cy="82" rx="13" ry="6" fill="#b4855a"/>`,
        },
      ],
      bas: [
        {
          nom: 'Y-3 Black Trousers', url: '/produits/pantalon-y3-noir', zIndex: 2,
          shape: `<path d="M39 212 Q31 228 34 248 L46 364 L68 364 L79 254 L81 254 L92 364 L114 364 L126 248 Q129 228 121 212Z" fill="#1a1a1a"/>`,
        },
        {
          nom: 'Indigo Slim Jeans', url: '/produits/jean-slim', zIndex: 2,
          shape: `<path d="M39 212 Q31 228 34 248 L46 364 L68 364 L79 254 L81 254 L92 364 L114 364 L126 248 Q129 228 121 212Z" fill="#3a5a8c"/>`,
        },
        {
          nom: 'Beige Chinos', url: '/produits/chino-beige', zIndex: 2,
          shape: `<path d="M39 212 Q31 228 34 248 L46 364 L68 364 L79 254 L81 254 L92 364 L114 364 L126 248 Q129 228 121 212Z" fill="#c8b898"/>`,
        },
      ],
      chaussures: [
        {
          nom: 'Y-3 Black Sneaker', url: '/produits/chaussure-y3', zIndex: 1,
          shape: `<rect x="32" y="358" width="34" height="13" rx="5" fill="#111"/><rect x="94" y="358" width="34" height="13" rx="5" fill="#111"/><ellipse cx="49" cy="371" rx="19" ry="6" fill="#0a0a0a"/><ellipse cx="111" cy="371" rx="19" ry="6" fill="#0a0a0a"/>`,
        },
        {
          nom: 'Brown Leather Derby', url: '/produits/derby-marron', zIndex: 1,
          shape: `<path d="M30 362 Q41 351 63 353 L65 371 L30 373Z" fill="#6b3a2a"/><path d="M95 353 Q117 351 130 362 L130 373 L95 371Z" fill="#6b3a2a"/>`,
        },
        {
          nom: 'Black Chelsea Boot', url: '/produits/boot-chelsea', zIndex: 4,
          shape: `<rect x="32" y="348" width="32" height="24" rx="5" fill="#222"/><rect x="96" y="348" width="32" height="24" rx="5" fill="#222"/>`,
        },
      ]
    },
    femme: {
      chapeau: [
        {
          nom: 'Natural Raffia Bucket Hat', url: '/produits/bob-raphia', zIndex: 5,
          shape: `<ellipse cx="80" cy="19" rx="32" ry="14" fill="#c8aa78"/><ellipse cx="80" cy="23" rx="41" ry="8" fill="#b89860"/>`,
        },
        {
          nom: 'Bordeaux Beret', url: '/produits/beret-bordeaux', zIndex: 5,
          shape: `<ellipse cx="86" cy="17" rx="28" ry="16" fill="#8b2635"/><rect x="75" y="30" width="10" height="4" rx="2" fill="#6e1e29"/>`,
        },
        {
          nom: 'White Cap', url: '/produits/casquette-blanche', zIndex: 5,
          shape: `<ellipse cx="80" cy="21" rx="32" ry="11" fill="#f0ede8"/><rect x="48" y="19" width="64" height="7" rx="2" fill="#ddd8d0"/>`,
        },
      ],
      haut: [
        {
          nom: 'Cream Blazer', url: '/produits/blazer-creme', zIndex: 3,
          shape: `<path d="M52 76 Q40 84 38 112 L38 178 L65 182 L65 92 L80 88 L95 92 L95 182 L122 178 L122 112 Q120 84 108 76 Q95 70 80 70 Q65 70 52 76Z" fill="#e8deca"/>`,
        },
        {
          nom: 'Ivory Silk Top', url: '/produits/top-soie', zIndex: 3,
          shape: `<path d="M58 76 Q46 82 44 110 L44 176 L80 178 L116 176 L116 110 Q114 82 102 76 Q92 70 80 70 Q68 70 58 76Z" fill="#f0ece4"/>`,
        },
        {
          nom: 'Pink Mohair Sweater', url: '/produits/pull-rose', zIndex: 3,
          shape: `<path d="M52 76 Q40 84 38 112 L38 178 L65 182 L65 92 L80 88 L95 92 L95 182 L122 178 L122 112 Q120 84 108 76 Q95 70 80 70 Q65 70 52 76Z" fill="#d4a0a8"/>`,
        },
      ],
      bas: [
        {
          nom: 'Black Midi Skirt', url: '/produits/jupe-midi', zIndex: 2,
          shape: `<path d="M44 198 Q36 216 34 234 L34 338 Q34 350 80 352 Q126 350 126 338 L126 234 Q124 216 116 198Z" fill="#1a1a1a"/>`,
        },
        {
          nom: 'Ecru Wide-Leg Trousers', url: '/produits/pantalon-ecru', zIndex: 4,
          shape: `<path d="M42 196 Q34 214 36 232 L48 368 L68 368 L79 252 L81 252 L92 368 L112 368 L124 232 Q126 214 118 196Z" fill="#e8e0cc"/>`,
        },
        {
          nom: 'High-Waist Jeans', url: '/produits/jean-femme', zIndex: 2,
          shape: `<path d="M42 196 Q34 214 36 232 L48 368 L68 368 L79 252 L81 252 L92 368 L112 368 L124 232 Q126 214 118 196Z" fill="#4a6090"/>`,
        },
      ],
      chaussures: [
        {
          nom: 'Nude Heels', url: '/produits/escarpins-nude', zIndex: 1,
          shape: `<path d="M34 362 Q43 350 62 352 L64 370 L34 370Z" fill="#c8a888"/><path d="M50 352 L50 336" stroke="#b89878" stroke-width="4" fill="none"/><path d="M96 352 Q115 350 126 362 L126 370 L96 370Z" fill="#c8a888"/><path d="M110 352 L110 336" stroke="#b89878" stroke-width="4" fill="none"/>`,
        },
        {
          nom: 'White Sneaker', url: '/produits/sneaker-blanc', zIndex: 1,
          shape: `<rect x="32" y="360" width="34" height="13" rx="5" fill="#f0f0ee"/><rect x="94" y="360" width="34" height="13" rx="5" fill="#f0f0ee"/>`,
        },
        {
          nom: 'Camel Ankle Boots', url: '/produits/bottines-camel', zIndex: 4,
          shape: `<rect x="34" y="350" width="30" height="24" rx="4" fill="#c4956a"/><rect x="96" y="350" width="30" height="24" rx="4" fill="#c4956a"/>`,
        },
      ]
    }
  };

  onGenderChange(event: Event): void {
    this.setGender((event.target as HTMLSelectElement).value);
  }

  setGender(g: string): void {
    this.gender.set(g as 'homme' | 'femme');
    this.indexes.set({ chapeau: -1, haut: -1, bas: -1, chaussures: -1 });
  }

  next(cat: Cat): void {
    const idx = this.indexes();
    const len = this.catalogue[this.gender()][cat].length;
    this.indexes.set({ ...idx, [cat]: idx[cat] === len - 1 ? -1 : idx[cat] + 1 });
  }

  prev(cat: Cat): void {
    const idx = this.indexes();
    const len = this.catalogue[this.gender()][cat].length;
    let n = idx[cat];
    if (n === -1) n = len - 1;
    else if (n === 0) n = -1;
    else n--;
    this.indexes.set({ ...idx, [cat]: n });
  }

  getItem(cat: Cat): VetementItem | null {
    const i = this.indexes()[cat];
    return i === -1 ? null : this.catalogue[this.gender()][cat][i];
  }

  // Mode image : retourne true si le vêtement a une vraie photo
  hasImg(cat: Cat): boolean { return !!this.getItem(cat)?.imgSrc; }
  getImgSrc(cat: Cat): string  { return this.getItem(cat)?.imgSrc ?? ''; }
  getImgTop(cat: Cat): string  { return this.getItem(cat)?.imgTop ?? '0%'; }
  getImgLeft(cat: Cat): string { return this.getItem(cat)?.imgLeft ?? '0%'; }
  getImgWidth(cat: Cat): string { return this.getItem(cat)?.imgWidth ?? '100%'; }

  // Mode SVG (test) : retourne le shape brut
  getShape(cat: Cat): string { return this.getItem(cat)?.shape ?? ''; }

  getZIndex(cat: Cat): number { return this.getItem(cat)?.zIndex ?? 1; }
  getNom(cat: Cat): string    { return this.getItem(cat)?.nom.replace(/ /g, '_') ?? '—'; }
  getUrl(cat: Cat): string    { return this.getItem(cat)?.url ?? ''; }
  hasItem(cat: Cat): boolean  { return this.indexes()[cat] !== -1; }
  isHomme(): boolean          { return this.gender() === 'homme'; }
  isFemme(): boolean          { return this.gender() === 'femme'; }

 
}