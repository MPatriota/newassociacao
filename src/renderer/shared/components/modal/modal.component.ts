import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'modal',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: 'modal.component.html',
  styleUrl: `modal.component.scss`
})
export class ModalComponent {

  @Input({ required: true }) title!: string;

  @Output() onHide: EventEmitter<void> = new EventEmitter<void>();

  @Input() visible: boolean = false;

  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter();

  @Input() zIndex: number = 999;

    hide() {
    this.onHide.emit();
  }

  @Input() showClose= true;

}
