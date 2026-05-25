import { CdkDragMove, DragDropModule } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-cabine-preview',
  imports: [BrowserModule,DragDropModule],
  templateUrl: './cabine-preview.component.html',
  styleUrl: './cabine-preview.component.scss',
})
export class CabinePreviewComponent {

  @Input() item: any;
  @Output() coordsChange = new EventEmitter<{x: number, y: number}>();

  dragItem(event: CdkDragMove<any>) {
    const container = (event.source.element.nativeElement.parentElement as HTMLElement).getBoundingClientRect();
    const xPx = event.pointerPosition.x - container.left;
    const yPx = event.pointerPosition.y - container.top;

    this.coordsChange.emit({x: xPx, y: yPx});
  }
}





