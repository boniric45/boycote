export interface Product {
    id:number;
    sku:string;
    name:string;
    description:string;
    conditions:string;
    marque:string;
    type:string;
    gender:string;
    size:string;
    mesure:string;
    prix:number;
    stock:number;
    pathpictureone:string;
    pathpicturetwo:string;
    pathpicturethree:string;
    pathpicturefour:string;
	  pathpicturefive:string;
    pathpicturesix:string;
    pathpictureseven:string;
    pathpictureeight:string;
    pathpicturenine:string;
    pathpictureten:string;
    picturecabine:string;
    productlink:string;
    titleproductcabine:string;
    zindexcabine:string;
    xcabine:number;
    ycabine:number;
    widthcabine:number;
    heightcabine:number;
}

export interface AddProductResponse {
  success: boolean;
  id: number;
}

export interface ProductFilter {
  marque?: string[];
  type?: string[];
  gender?: string[];
}

export interface CartItem {
  id: number;
  nom: string;
  taille: string;
  genre: string;
  prix: number;
  image?: string;
}