import { CdkDragMove, DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Outfit {
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
}

@Component({
  selector: 'app-cabine-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cabine-admin.component.html',
  styleUrl: './cabine-admin.component.scss',
})
export class CabineAdminComponent {

 @ViewChild('canvas') canvas!: ElementRef;
// Valeurs initiales du formulaire et de l'image
  x: number = 50;
  y: number = 50;
  width: number = 300;
  height: number = 200;

  // Gestion de l'état interne pour le drag and drop / resize
  private currentAction: 'move' | 'resize' | null = null;
  private startX: number = 0;
  private startY: number = 0;
  private startW: number = 0;
  private startH: number = 0;
  private startXPos: number = 0;
  private startYPos: number = 0;

  // Déclenché au clic (sur l'image pour déplacer, sur la poignée pour redimensionner)
  startDrag(event: MouseEvent, action: 'move' | 'resize') {
    event.preventDefault();
    event.stopPropagation(); // Évite que le resize déclenche aussi le move

    this.currentAction = action;
    this.startX = event.clientX;
    this.startY = event.clientY;
    
    this.startW = this.width;
    this.startH = this.height;
    this.startXPos = this.x;
    this.startYPos = this.y;
  }

  // Écoute globale des mouvements de la souris
  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.currentAction) return;

    const deltaX = event.clientX - this.startX;
    const deltaY = event.clientY - this.startY;

    if (this.currentAction === 'move') {
      this.x = this.startXPos + deltaX;
      this.y = this.startYPos + deltaY;
    } else if (this.currentAction === 'resize') {
      // Taille minimale de sécurité à 50px
      this.width = Math.max(50, this.startW + deltaX);
      this.height = Math.max(50, this.startH + deltaY);
    }

    this.validateBounds();
  }

  // Fin de l'action au relâchement du clic de souris
  @HostListener('document:mouseup')
  onMouseUp() {
    this.currentAction = null;
  }

  // Validation des données issues du formulaire ou du drag
  validateBounds() {
    if (this.x < 0) this.x = 0;
    if (this.y < 0) this.y = 0;
    if (this.width < 50) this.width = 50;
    if (this.height < 50) this.height = 50;

    // Optionnel : Limitation par rapport aux bordures du canvas parent
    if (this.canvas) {
      const canvasEl = this.canvas.nativeElement;
      const maxW = canvasEl.clientWidth;
      const maxH = canvasEl.clientHeight;

      if (this.x + this.width > maxW) {
        // Décommenter si vous souhaitez bloquer l'image dans le cadre à droite
        // this.x = maxW - this.width;
      }
    }
  }

}
