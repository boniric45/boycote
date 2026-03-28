import { NgStyle } from '@angular/common';
import {  Component, Input, output } from '@angular/core';

@Component({
  selector: 'app-component-right',
  imports: [NgStyle],
  templateUrl: './component-right.component.html',
  styleUrl: './component-right.component.scss'
})
export class ComponentRightComponent  {

outputRight = output<string>();
disabled: boolean = false;
opacity = 1;
scale ='1';

clickBtnRight():void {
 this.outputRight.emit('right');
 this.timeOutButtonDisabled();
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
