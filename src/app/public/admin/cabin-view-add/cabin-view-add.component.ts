import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-cabin-view-add',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cabin-view-add.component.html',
  styleUrl: './cabin-view-add.component.scss',
})

export class CabinViewAddComponent {

   @ViewChild('canvas') canvas!: ElementRef;

  @Output() update = new EventEmitter<any>();

  @Input() picture: string | null = null;
  @Input() x: number = 0;
  @Input() y: number = 0;
  @Input() w: number = 30;
  @Input() h: number = 30;
  @Input() z: number = 10;

  mannequinImg = 'pictures/mannequin-homme.webp';

  private currentAction: 'move' | 'resize' | null = null;
  private startX = 0;
  private startY = 0;
  private startXP = 0;
  private startYP = 0;
  private startW = 0;
  private startH = 0;

  startDrag(event: MouseEvent, action: 'move' | 'resize') {
    event.preventDefault();
    event.stopPropagation();

    this.currentAction = action;
    this.startX = event.clientX;
    this.startY = event.clientY;

    this.startXP = this.x;
    this.startYP = this.y;
    this.startW = this.w;
    this.startH = this.h;
  }

  @HostListener('document:mousemove', ['$event'])
  onMove(event: MouseEvent) {
    if (!this.currentAction || !this.canvas) return;

    const canvasEl = this.canvas.nativeElement;
    const cw = canvasEl.clientWidth;
    const ch = canvasEl.clientHeight;

    const dx = ((event.clientX - this.startX) / cw) * 100;
    const dy = ((event.clientY - this.startY) / ch) * 100;

    if (this.currentAction === 'move') {
      this.x = Math.round(this.startXP + dx);
      this.y = Math.round(this.startYP + dy);
    } else {
      this.w = Math.max(5, Math.round(this.startW + dx));
      this.h = Math.max(5, Math.round(this.startH + dy));
    }

    this.update.emit({
      x: this.x,
      y: this.y,
      w: this.w,
      h: this.h,
      z: this.z
    });
  }

  @HostListener('document:mouseup')
  stopDrag() {
    this.currentAction = null;
  }

  get style() {
    return {
      left: this.x + '%',
      top: this.y + '%',
      width: this.w + '%',
      height: this.h + '%',
      zIndex: this.z
    };
  }
}


