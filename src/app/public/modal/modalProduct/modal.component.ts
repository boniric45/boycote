import { ChangeDetectionStrategy, Component, Inject,OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogClose, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-modal',
  imports: [MatButtonModule, MatDialogClose, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent implements OnInit {

  pictureProduct = "";
  pictureProductIHM = "";

  constructor(@Inject(MAT_DIALOG_DATA) public data:any){
  this.pictureProduct = data;  
  }

  ngOnInit(): void {
    // lit l'objet récupéré par le constructeur et affecte sa valeur à picture product ihm  
    Object.values(this.pictureProduct).forEach(p => {this.pictureProductIHM = p});
  }



}
