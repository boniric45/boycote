import { CdkDragMove, DragDropModule } from '@angular/cdk/drag-drop';
import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CabineComponent } from "../../cabine/cabine.component";


@Component({
  selector: 'app-cabine-virtuelle-preview',
  imports: [DragDropModule],
  templateUrl: './cabine-virtuelle-preview.component.html',
  styleUrl: './cabine-virtuelle-preview.component.scss',
})
export class CabineVirtuellePreviewComponent {

@Input() formCabin!: FormGroup;

  item = {
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    zIndex: 1,
    src: ''
  };

  ngOnInit() {
    // Synchronisation initiale
    this.formCabin.valueChanges.subscribe(values => {
      this.item = {
        x: values.positionx ?? 0,
        y: values.positiony ?? 0,
        width: values.width ?? 100,
        height: values.height ?? 100,
        zIndex: values.zindex ?? 1,
        src: values.picturecabin ?? ''
      };
    });
  }

  // Drag & drop
  onDrag(event: CdkDragMove) {
    this.item.x = event.source.getFreeDragPosition().x;
    this.item.y = event.source.getFreeDragPosition().y;

    this.formCabin.patchValue({
      positionx: this.item.x,
      positiony: this.item.y
    }, { emitEvent: false });
  }

  // Resize
  startResize(event: MouseEvent, corner: string) {
    event.preventDefault();
    const startX = event.clientX;
    const startY = event.clientY;
    const startWidth = this.item.width;
    const startHeight = this.item.height;

    const mouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;

      if (corner.includes('right')) this.item.width = startWidth + dx;
      if (corner.includes('bottom')) this.item.height = startHeight + dy;
      if (corner.includes('left')) this.item.width = startWidth - dx;
      if (corner.includes('top')) this.item.height = startHeight - dy;

      this.formCabin.patchValue({
        width: this.item.width || 100,
        height: this.item.height || 100
      }, { emitEvent: false });
    };

    const mouseUp = () => {
      document.removeEventListener('mousemove', mouseMove);
      document.removeEventListener('mouseup', mouseUp);
    };

    document.addEventListener('mousemove', mouseMove);
    document.addEventListener('mouseup', mouseUp);
  }

getCabinImg(): string {
  const path = this.formCabin.get('picturecabin')?.value;
  if (!path) return 'ko';
  return path.startsWith('/pictures') ? `https://boycote.fr${path}` : path;
}





}
