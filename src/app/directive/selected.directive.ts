import { Directive, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSelect  } from '@angular/material/select';
import { delay } from 'rxjs';


@Directive({
  selector: '[appSelected]',
  outputs:['isMatOpen']
})
export class SelectedDirective implements OnInit{

   constructor(private matSelected: MatSelect){}

    ngOnInit(): void {

    this.matSelected.openedChange.pipe(delay(7000)).subscribe(isOpen => {
      
      if(isOpen)
        {
          this.matSelected.close();
        } 
      // else 
      // {
      // console.log('Is Closed => ');
      //       // console.log('Is Closed', this.matSelected.panel);
      // }


    });

    }
}
