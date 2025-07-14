import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'search-bar',
  templateUrl: 'search-bar.component.html',
  imports: [
    CommonModule,
    InputIconModule,
    InputTextModule,
    ButtonModule,
    IconFieldModule,
    FormsModule
  ],
  styles: `
    .filter-icon-container {
      position: absolute;
      right: 5px;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      align-items: center;
      cursor: pointer;
      z-index: 2;
    }

    .filter-icon {
      color: black;
      font-size: 1rem;
      transition: all 0.3s ease;
      padding: 0.5rem;

      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
        border-radius: 50%;
      }
    }

    .filter-label {
      position: absolute;
      left: calc(100% + 5px);
      white-space: nowrap;
      background-color: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      opacity: 0;
      transform: translateX(-10px);
      transition: all 0.3s ease;
      pointer-events: none;

      &.visible {
        opacity: 1;
        transform: translateX(0);
      }
    }

    /* Ajuste para posicionar o ícone de filtro corretamente ao lado do campo de pesquisa */
    .p-input-icon-left {
      position: relative;

      input {
        padding-right: 2.5rem; /* Espaço para o ícone de filtro */
      }
    }
  `
})
export class SearchBarComponent {

  search: string | null = null;
  showFilterLabel: boolean = false;

  @Output() onSearch: EventEmitter<string | null> = new EventEmitter();
  @Output() onNewClick: EventEmitter<void> = new EventEmitter();
  @Output() onFilterClick: EventEmitter<void> = new EventEmitter();

  @Input() showAdvancedFilters: boolean = false;
  @Input() icon: string | undefined;
  @Input({ required: true }) title!: string;

}
