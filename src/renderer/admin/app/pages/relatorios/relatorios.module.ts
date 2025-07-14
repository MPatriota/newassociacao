import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RelatoriosRoutingModule } from './relatorios-routing.module';
import { RelatoriosComponent } from './relatorios.component';
import { FinanceiroCondicaoPagamentoComponent } from './financeiro-condicao-pagamento.component';
import { FinanceiroClienteComponent } from './financeiro-cliente.component';
import { VendasPeriodoComponent } from './vendas-periodo.component';

@NgModule({
  imports: [
    CommonModule,
    RelatoriosRoutingModule,
    RelatoriosComponent,
    FinanceiroCondicaoPagamentoComponent,
    FinanceiroClienteComponent,
    VendasPeriodoComponent
  ]
})
export class RelatoriosModule {}
