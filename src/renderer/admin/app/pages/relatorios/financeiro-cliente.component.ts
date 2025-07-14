import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RelatoriosService } from './relatorios.service';

@Component({
  selector: 'app-financeiro-cliente',
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
          <th>Cliente</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let item of resultados">
          <td>{{ item.cliente }}</td>
          <td>{{ item.total | currency:'BRL' }}</td>
        </tr>
      </tbody>
    </table>
  `,
})
export class FinanceiroClienteComponent {
  titulo = 'Financeiro por Cliente';
  dataInicio = '';
  dataFim = '';
  resultados: any[] = [];

  constructor(private relatoriosService: RelatoriosService) {}

  buscar() {
    if (this.dataInicio && this.dataFim) {
      this.relatoriosService.getFinanceiroPorCliente(this.dataInicio, this.dataFim)
        .subscribe(data => this.resultados = data);
    }
  }
}
