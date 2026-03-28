import { Component, EventEmitter, Output } from '@angular/core';
import { FoldermacComponent } from "../foldermac/foldermac.component";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-footer',
  imports: [FoldermacComponent, RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

  @Output() folderClick = new EventEmitter<string>();

  onClick(route: string = 'contact') {
    this.folderClick.emit(route);
  }



}

