import { Component, ElementRef, inject, OnInit, output } from '@angular/core';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MarqueService } from '../../services/marque.service';
import { Marque } from '../../models/marque';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { SelectedDirective } from '../../directive/selected.directive';


@Component({
  selector: 'app-header',
  imports: [MatButtonModule, MatDividerModule, MatIconModule, MatFormFieldModule, MatSelectModule, FormsModule, ReactiveFormsModule, MatIcon, SelectedDirective],

  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{

  vetementsList: string[] = ['Tshirt', 'Pantalon', 'Boxer', 'Chaussette', 'Casquette'];
  tailleList: string[] = ['XS', 'M', 'L', 'XL', 'XXL', 'Taille Unique'];
  genreList: string[] = ['Femme', 'Homme'];
  marques!: Marque[];
  vetementListSelected: string[] = [];
  marquesListSelected: string[] = [];
  genreListSelected: string[] = [];
  listGlobal: Product[] = [];
  inputSelected!: string[];

  panelMarquesIsOpen:boolean = false;
  marqueIsDisabled = false;

  panelVetementIsOpen:boolean = false;
  vetementIsDisabled = true;

  panelGenderIsOpen:boolean = false;
  genreIsDisabled = true;

  private productService = inject(ProductService);
  private marqueService = inject(MarqueService);
  outputHeader = output<string[]>();
  listMarqueResult: Product[] = [];
  listVetementResult: Product[] = [];
  listGenreResult: Product[] = [];
  reinitSelectMarque: string = '';
  reinitSelectVetement: string = '';
  reinitSelectGender: string = '';
  

     // Faire un tableau d'objet pour controler les objets de la liste
  ngOnInit(): void {
    
    // Récupère les marques
     this.marqueService.getMarques().subscribe(m => this.marques = m); 
  
    // Récupère tous les produits 
   this.productService.getProducts().subscribe(p => 
   {
    this.listGlobal = p
   // this.productService.addListProductFiltered(p); // Injecte dans le service
   });

   // Récupérer les produits avec le service product 
   // renvoyer le résultat dans le services
   // Envoyer les résultats sur le carousel 

    

    // this.getProductByMarque('Camper');
    // this.getProductByGender('Femme');
    // this.getProductByType('Bonnet');  

  }

  // reset la liste déroulante
  resetMarque() {
    this.reinitSelectMarque = '';
  }

  resetVetement() {
    this.reinitSelectVetement = '';
  }

  resetGender() {
    this.reinitSelectGender = '';
  }

/////////////////////////////////////// Récupération par liste //////////////////////////////////

//********************************* Marques *************************************/

//   // Récupère la saisie utilisateur 
//   getMarquesSelectedUser($event: MatSelectChange<string[]> ) {
//     // Récupère les valeurs de la liste du template sélectionné
//     this.marquesListSelected = $event.value;
//    // this.productSelectedService.listMarqueSelected = this.marquesListSelected;
//   }

//   // Fonction Première lancé via un clic et lance la recherche une fois la liste fermée
//   marquesIsOpen(bool:boolean) {
//     if(!bool){
//       this.panelMarquesIsOpen = true;
//       // volet ouvert
//     } else {
//       this.panelMarquesIsOpen = false;
//       // volet fermé
//        this.getMarqueResult(this.marquesListSelected);
//     }

//   }
  
//   // récupère les informations cochées dans la liste et recherche les produits
//   getMarqueResult(marquesSelected: string[]) {
//     marquesSelected.forEach(el => {
//       this.getProductByMarque(el);
//     });
//   }

//   // Recherche le produit pour une marque
//   getProductByMarque(marque: string) {
//     this.productService.getProductByMarque(marque).subscribe((p) => {
//       this.listMarqueResult = p;
//       this.listMarqueResult.forEach(el => console.log('<< Product >> ', el))
//       }
//     );
//   }


// //********************************* Vetements *************************************/


//   // Récupère la saisie utilisateur 
//   getTypeView($event: MatSelectChange<string[]>) {
//     this.vetementListSelected = $event.value;
//   }
  
//   // Fonction Première lancé via un clic et lance la recherche une fois la liste fermée
//   vetementIsOpen(bool:boolean){
//     if(!bool){
//       this.panelVetementIsOpen = true;
//       console.log('Volet Vetement Ouvert'); 
//     } else {
//       this.panelVetementIsOpen = false;
//       console.log('Volet Vetement Fermé');
//        this.getVetementResult(this.vetementListSelected);

//     }
//   }


//   // récupère les informations cochées dans la liste et recherche les produits
//   getVetementResult(vetementSelected: string[]) {
//     vetementSelected.forEach(el => {
//       this.getProductByVetement(el);
//     });
//   }


//   // Recherche le produit pour un vetement
//   getProductByVetement(vetement: string) {
//     this.productService.getProductByType(vetement).subscribe((p) => {
//       this.listVetementResult = p;
//       this.listVetementResult.forEach(el => console.log('<< Product >> ', el))
//     }
//     );
//   }

// //********************************* Genre *************************************/


//   // Récupère la saisie utilisateur 
//   getGenderView($event: MatSelectChange<string[]>) {
//     this.genreListSelected = $event.value;
//   }
  
//   // Fonction Première lancé via un clic et lance la recherche une fois la liste fermée
//   genderIsOpen(bool:boolean){
//     if(!bool){
//       this.panelGenderIsOpen = true;
//       console.log('Volet Vetement Ouvert'); 
//     } else {
//       this.panelGenderIsOpen = false;
//       console.log('Volet Vetement Fermé');
//        this.getVetementResult(this.vetementListSelected);

//     }
//   }


//   // récupère les informations cochées dans la liste et recherche les produits
//   getGenderResult(genderSelected: string[]) {
//     genderSelected.forEach(el => {
//       this.getProductByVetement(el);
//     });
//   }


//   // Recherche le produit pour un vetement
//   getProductByGender(gender: string) {
//     this.productService.getProductByType(gender).subscribe((p) => {
//       this.listGenderResult = p;
//       this.listGenderResult.forEach(el => console.log('<< Product >> ', el))
//     }
//     );
//   }

////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////// Deuxième Choix //////////////////////////////////////////

  // Récupère la saisie utilisateur 
 
  getMarquesSelectedUser($event: MatSelectChange<string[]> ) {
    // Récupère les valeurs de la liste du template sélectionné
    this.marquesListSelected = $event.value;
  }

  // Fonction Première lancé via un clic et lance la recherche une fois la liste fermée
  marquesIsOpen(bool:boolean) {
    if(!bool){
      // volet ouvert
      this.panelMarquesIsOpen = true;
            // réinitialise les listes déroulantes  
      this.resetMarque();
      this.resetVetement();
      this.resetGender();
    } else {
      // volet fermé
      this.listMarqueResult = [];
      this.panelMarquesIsOpen = false; // desactive la liste
      this.vetementIsDisabled = false;   
      if(this.marquesListSelected.length == 0){
        this.listMarqueResult = this.listGlobal;
      }  else {
        this.marquesListSelected.forEach(m => {        
          this.listGlobal.forEach(prod => {
            if (prod.marque == m) {
              this.listMarqueResult.push(prod);
            }
          })
        })
      }
    }
    console.log('Marque > ',this.listMarqueResult);
    
  }
  
          // Vetement 
  // Récupère la saisie utilisateur 
  getTypeSelectedUser($event: MatSelectChange<string[]>) {    
    this.vetementListSelected = $event.value;
  }

  // Fonction Première lancé via un clic et lance la recherche une fois la liste fermée
  vetementIsOpen(bool:boolean){
    if(!bool){
      this.panelVetementIsOpen = true;
      this.marqueIsDisabled = true;
    } else {
      this.listVetementResult = [];
      this.panelVetementIsOpen = false;
      this.vetementIsDisabled = true;
      this.genreIsDisabled = false;

      // Si la liste de sélection est vide je renvoi la liste des marques
       if (this.vetementListSelected.length == 0){
            this.listVetementResult = this.listMarqueResult;
            console.log(this.listVetementResult);
          } else {
            this.listMarqueResult.forEach(marq => {
              this.vetementListSelected.forEach(vetUser => {
              if (marq.type == vetUser) {
                this.listVetementResult.push(marq);
              }                
            })
          })
          }
    }
        // console.log('vetement > ',this.listVetementResult);
  }
  
 // Récupère la saisie utilisateur 
  getGenderSelectedUser($event: MatSelectChange<string[]>) {
    this.genreListSelected = $event.value;
  }
  
  // Fonction Première lancé via un clic et lance la recherche une fois la liste fermée
  genderIsOpen(bool:boolean){
    if(!bool){
      this.panelGenderIsOpen = true;
    } else {
      this.listGenreResult = [];
      this.panelGenderIsOpen = false;
      this.genreIsDisabled = true;
      this.marqueIsDisabled = false;

      if(this.genreListSelected.length == 0 ){
        this.listGenreResult = this.listVetementResult;
      } else {
        this.listVetementResult.forEach((vet) => {
        this.genreListSelected.forEach((genre) => {
        if(vet.gender === genre){this.listGenreResult.push(vet);}
            })
          })
      }
        console.log('Gender > ',this.listGenreResult);
     //   this.productService.addListProductFiltered(this.listGenreResult);
    }
  }






}
