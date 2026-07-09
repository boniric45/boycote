import { Directive, OnInit } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { delay, Subscription } from 'rxjs';


@Directive({
  selector: '[appSelected]',
  outputs:['isMatOpen']
})
export class SelectedDirective implements OnInit{

   constructor(private matSelected: MatSelect){}

   private _subMatSelected = Subscription.EMPTY;

    ngOnInit(): void {
      this._subMatSelected = this.matSelected.openedChange.pipe(delay(7000)).subscribe(isOpen => {
      if(isOpen)
        {
          this.matSelected.close();
        } 
    });
    }

    ngOnDestroy(){
      this._subMatSelected.unsubscribe();
    }
}
