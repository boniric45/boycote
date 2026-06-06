import { Component, EventEmitter, Output } from '@angular/core';
import { FoldermacComponent } from "../foldermac/foldermac.component";

@Component({
  selector: 'app-mini-footer',
  imports: [FoldermacComponent],
  templateUrl: './mini-footer.component.html',
  styleUrl: './mini-footer.component.scss',
})
export class MiniFooterComponent {

    @Output() folderClick = new EventEmitter<string>();

  onClick(route: string = 'contact') {
    this.folderClick.emit(route);
  }

}
