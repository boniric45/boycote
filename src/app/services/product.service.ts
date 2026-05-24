import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AddProductResponse, Product, ProductFilter } from '../models/product';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService  {
  
  // SERVICES
  private http = inject(HttpClient);
  private apiService = inject(ApiService);

  allProducts: Product[] = [];
  listOfProduct = signal<Product[]>([]);
  listProductOfCarouselStd:string[] = [];
  product!: Product;
  private apiUrl = 'https://www.boycoté.fr/api/addProduct.php';


   
  loadProducts() {
    return this.apiService.getProducts().pipe(
      tap((p) => (this.allProducts = p))
    );
  }

  /**
   * Retourne toutes les images du produit (pathpictureone → pathpictureten)
   */
  getProductImages(): string[] {
  if (!this.product) return [];

  // 1. Extraction des images pathpicture...
  const baseImages = Object.entries(this.product)
    .filter(([key, value]) =>
      key.toLowerCase().startsWith('pathpicture') &&
      typeof value === 'string' &&
      value.trim() !== ''
    )
    .map(([_, value]) => value);

  // 2. Si aucune image → retourne vide
  if (baseImages.length === 0) return [];

  // 3. On crée une nouvelle liste qui répète les images dans l'ordre
  const finalImages: string[] = [];

  while (finalImages.length < 10) {
    for (const img of baseImages) {
      if (finalImages.length < 10) {
        finalImages.push(img);
      } else {
        break;
      }
    }
  }

  return finalImages;
  }

  getProductImagesWithoutDuplicate(): string[] {
  if (!this.product) return [];

  // 1. Extraction des images pathpicture...
  const baseImages = Object.entries(this.product)
    .filter(([key, value]) =>
      key.toLowerCase().startsWith('pathpicture') &&
      typeof value === 'string' &&
      value.trim() !== ''
    )
    .map(([_, value]) => value);

  // 2. Si aucune image → retourne vide
  if (baseImages.length === 0) return [];

  // 3. On crée une nouvelle liste qui répète les images dans l'ordre
  const finalImages: string[] = [];
  if (finalImages.length < 10) {
    for (const img of baseImages) {
      finalImages.push(img);
    }
  }
    return finalImages;
  }

  filterProducts(criteria: ProductFilter): Product[] {
    return this.allProducts.filter(p => {

      // Normalisation produit
      const marque = p.marque?.trim().toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // enlève accents
        .replace(/[^a-z0-9 ]/gi, ""); // enlève caractères spéciaux

      const type = p.type?.trim().toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9 ]/gi, "");

      const gender = p.gender?.trim().toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9 ]/gi, "");

      // Normalisation critères
      const selectedMarques = criteria.marque?.map(m =>
        m.trim().toLowerCase()
          .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9 ]/gi, "")
      );

      const selectedTypes = criteria.type?.map(t =>
        t.trim().toLowerCase()
          .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9 ]/gi, "")
      );

      const selectedGenders = criteria.gender?.map(g =>
        g.trim().toLowerCase()
          .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9 ]/gi, "")
      );

      // Filtrage
      if (selectedMarques?.length && !selectedMarques.includes(marque)) {
        return false;
      }

      if (selectedTypes?.length && !selectedTypes.includes(type)) {
        return false;
      }

      if (selectedGenders?.length && !selectedGenders.includes(gender)) {
        return false;
      }

      return true;
    });
  }

  addProduct(product: Product):Observable<AddProductResponse> {
    return this.http.post<AddProductResponse>(this.apiUrl, product);
  }

  // A TESTER 
  getProduct(id: number): Observable<{ success: boolean; product: Product }> {
  return this.http.get<{ success: boolean; product: Product }>(
    'https://www.boycoté.fr/api/getProduct.php?id=' + id
  );
}
  // SUPPRIME LA PREMIERE IMAGE DU TABLEAU //
  deleteFirstPicture(article:string[]):any[]{

    let result = [];

    if(article[0] == null){
      return [];
    } else {
     article.shift();
     result.push(article);
    }
    return result;
  }


  buildImageObjects(product: any) {
    const images: { id: number; pathpictureone: string }[] = [];
    let id = 1;

    for (const key of Object.keys(product)) {
      if (key.toLowerCase().startsWith('pathpicture') && product[key]) {
        images.push({
          id: id++,
          pathpictureone: product[key]
        });
      }
    }

    return images;
  }



  /* -----------------------------------------------------------
     GET PRODUCT BY SKU
  ----------------------------------------------------------- */
getProductIdBySKU(sku: string): number {
  const product = this.allProducts.find(p => p.sku === sku);
  return product ? product.id : 0;
}












}
