import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-button-return',
  imports: [],
  templateUrl: './button-return.component.html',
  styleUrl: './button-return.component.scss',
})
export class ButtonReturnComponent {

  private location = inject(Location);
  
  isClicked = false;

  handleClick() {
    this.isClicked = true;

    // Animation / état visuel
    setTimeout(() => {
      this.location.back();      
    }, 0);

    setTimeout(() => {
      this.isClicked = false;
    }, 300);
  }

}
