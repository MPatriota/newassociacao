import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'sidebar',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './sidebar-inside.component.html',
  styleUrl: './sidebar-inside.component.scss'
})
export class SidebarInsideComponent {

  @Input({ required: true }) title!: string;
  @Input() icon: string | undefined;

  sidebarOpen = false;

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

}
