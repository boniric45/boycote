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
    pictureCabine:string;
    productLink:string;
    titleProductCabine:string;
    zindexcabine:string;
    xcabine:number;
    ycabine:number;
    widthCabine:number;
    heightCabine:number;
}

export interface AddProductResponse {
  success: boolean;
  id: number;
}