import { Component, Input, OnInit } from '@angular/core';
import { Quiosque } from '../../../../../shared/model/quiosque.model';
import { QuiosqueService } from '../../../../../shared/services/quiosque.service';

@Component({
  selector: 'quiosque-view',
  standalone: false,
  templateUrl: 'quiosque-view.component.html',
  styleUrl: `quiosque-view.component.scss`
})
export class QuiosqueViewComponent implements OnInit {

  @Input() id!: number;

  quiosque!: Quiosque;
  showFullDescription: boolean = false;
  utensiliosExpanded: boolean = false;
  descriptionTruncated: boolean = false;
  maxDescriptionLength: number = 150;

  constructor(private quiosqueService: QuiosqueService) {}

  ngOnInit(): void {
    this.quiosqueService.findById(this.id)
      .subscribe((quiosque: Quiosque) => {
        if (quiosque.descricao && quiosque.descricao.length > this.maxDescriptionLength) this.descriptionTruncated = true;
        this.quiosque = quiosque;
      })
  }

  toggleDescription(): void {
    this.showFullDescription = !this.showFullDescription;
  }

  toggleUtensilios(): void {
    this.utensiliosExpanded = !this.utensiliosExpanded;
  }

  getStatusLabel(): string {
    return this.quiosque.status ? 'Disponível' : 'Indisponível';
  }

  getStatusClass(): string {
    return this.quiosque.status ? 'status-available' : 'status-unavailable';
  }

}
