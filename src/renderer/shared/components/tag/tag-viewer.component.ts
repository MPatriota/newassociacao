import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'tag-viewer',
  template: `
    <div class="tag"
         [class.interactive]="interactive"
         [style.background-color]="background"
         [style.color]="isLightColor(background) ? '#000' : '#fff'">
      <div class="tag-content">
        <i class="pi pi-tag text-sm"></i>
        <span class="tag-text">{{ value }}</span>
      </div>
    </div>
  `,
  imports: [TagModule, CommonModule],
  styles: [`
    .tag {

      display: inline-flex;
      align-items: center;
      justify-content: space-between;
      border-radius: 12px;
      padding: 2px 8px 2px 8px;
      font-size: 0.75rem;
      width: fit-content;
      min-width: 0;
      gap: 2px;
      height: 22px;
      line-height: 1;

      &.interactive:hover {
        cursor: pointer;
        filter: brightness(0.95);
        box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
      }

    }

    .tag-content {
      display: flex;
      align-items: center;
      gap: 4px;
      min-width: 0;
    }

    .tag-text {
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      min-width: 0;
      max-width: 120px;
    }

    i {
      font-size: 0.75rem;
    }

  `],
  standalone: true
})
export class TagViewerComponent {

  @Input() value: string = 'Nome da Tag';
  @Input() background: string = '#e9ecef';
  @Input() interactive: boolean = false;
  @Output() onDelete = new EventEmitter<void>();

  isLightColor(color: string): boolean {
    if (!color) return true;
    const hex = color.replace('#', '');
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 180;
  }
}
