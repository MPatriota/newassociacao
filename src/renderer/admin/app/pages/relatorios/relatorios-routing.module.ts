import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RelatoriosComponent } from './relatorios.component';
import { FinanceiroCondicaoPagamentoComponent } from './financeiro-condicao-pagamento.component';
import { FinanceiroClienteComponent } from './financeiro-cliente.component';
import { VendasPeriodoComponent } from './vendas-periodo.component';

const routes: Routes = [
  {
    path: '',
    component: RelatoriosComponent,
    children: [
      { path: 'financeiro-condicao-pagamento', component: FinanceiroCondicaoPagamentoComponent },
      { path: 'financeiro-cliente', component: FinanceiroClienteComponent },
      { path: 'vendas-periodo', component: VendasPeriodoComponent },
      { path: '', redirectTo: 'financeiro-condicao-pagamento', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RelatoriosRoutingModule {}
