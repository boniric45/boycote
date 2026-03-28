import { NgStyle } from '@angular/common';
import { Component, inject, Input, output } from '@angular/core';

@Component({
  selector: 'app-component-left',
  imports: [NgStyle],
  templateUrl: './component-left.component.html',
  styleUrl: './component-left.component.scss'
})
export class ComponentLeftComponent {

outputLeft = output<string>();
disabled: boolean = false;
opacity = 1;
scale ='1';

clickBtnLeft():void {
this.timeOutButtonDisabled();
this.outputLeft.emit('left');
}

  timeOutButtonDisabled(){
   let delayButton = 200; // 1 Seconde

   do{
        // Button is enabled
        setTimeout(() => {
        this.disabled = false;
        this.opacity = 1;
        this.scale='1';
      }, delayButton)
   } 
      // Button is disabled
      while(delayButton === 0){
        this.disabled = true;
        this.opacity = 0.33;
          this.scale='0.85';
   } 
  }




}
