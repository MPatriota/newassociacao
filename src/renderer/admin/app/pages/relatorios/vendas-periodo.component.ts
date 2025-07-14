import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RelatoriosService } from './relatorios.service';

@Component({
  selector: 'app-vendas-periodo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h3>{{ titulo }}</h3>

    <div class="filtros">
      <label>Data Início:
        <input type="date" [(ngModel)]="dataInicio">
      </label>
      <label>Data Fim:
        <input type="date" [(ngModel)]="dataFim">
      </label>
      <button (click)="buscar()">Buscar</button>
    </div>

    <table *ngIf="resultados.length">
      <thead>
        <tr>
          <th>Produto</th>
          <th>Quantidade</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let item of resultados">
          <td>{{ item.produto }}</td>
          <td>{{ item.quantidade }}</td>
          <td>{{ item.total | currency:'BRL' }}</td>
        </tr>
      </tbody>
    </table>
  `
})
export class VendasPeriodoComponent {
  titulo = 'Vendas por Período';
  dataInicio = '';
  dataFim = '';
  resultados: any[] = [];

  constructor(private relatoriosService: RelatoriosService) {}

  buscar() {
    if (this.dataInicio && this.dataFim) {
      this.relatoriosService.getVendasPorPeriodo(this.dataInicio, this.dataFim)
        .subscribe(data => this.resultados = data);
    }
  }
}
