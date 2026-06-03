import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { BoycoteComponent } from "../boycote/boycote.component";

@Component({
  selector: 'app-stop-landscape',
  imports: [],
  templateUrl: './stop-landscape.component.html',
  styleUrl: './stop-landscape.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StopLandscapeComponent {

  // @Input() visible:boolean = false;
  visible: boolean = false;
  private mq!: MediaQueryList;
  
  private handler = (e: MediaQueryListEvent) => {
    this.visible = e.matches;
    this.cdr.markForCheck();
  };

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    if (typeof window === 'undefined') return;
    this.mq = window.matchMedia('(orientation: landscape) and (max-width: 900px)');
    this.visible = this.mq.matches;
    this.mq.addEventListener('change', this.handler);
  }

  ngOnDestroy() {
    if (this.mq) this.mq.removeEventListener('change', this.handler);
  }


}
