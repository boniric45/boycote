import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-foldermac',
  imports: [],
  templateUrl: './foldermac.component.html',
  styleUrl: './foldermac.component.scss',
})
export class FoldermacComponent {

  isClicked = false;

  private router = inject(Router);
  

  handleClick() {
    this.isClicked = false;
    setTimeout(() => this.isClicked = true, 0);
    setTimeout(() => this.isClicked = false, 400);
  }


}
