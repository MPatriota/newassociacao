import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';  // IMPORTAR RouterModule

@Component({
  selector: 'app-relatorios',
  standalone: true,
  imports: [CommonModule, RouterModule],  // adicionar RouterModule aqui
  template: `
    <h2>{{ titulo }}</h2>

    <nav>
      <a routerLink="financeiro-condicao-pagamento" routerLinkActive="active">Financeiro por Condição de Pagamento</a> |
      <a routerLink="financeiro-cliente" routerLinkActive="active">Financeiro por Cliente</a> |
      <a routerLink="vendas-periodo" routerLinkActive="active">Vendas por Período</a>
    </nav>

    <router-outlet></router-outlet>
  `,
  styles: [`
    nav a.active {
      font-weight: bold;
      text-decoration: underline;
    }
    nav a {
      margin-right: 10px;
    }
  `]
})
export class RelatoriosComponent {
  titulo = 'Relatórios';
}
