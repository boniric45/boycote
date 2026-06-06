import { Component } from '@angular/core';
import { MiniFooterComponent } from "../../mini-footer/mini-footer.component";
import { ButtonReturnComponent } from "../button-return/button-return.component";
import { FooterComponent } from "../../footer/footer.component";

@Component({
  selector: 'app-contact',
  imports: [ButtonReturnComponent, FooterComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {

  email     = 'contact@boycoté.fr';
  instagram = '@toncompte';

}
