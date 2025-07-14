import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('../../shared/components/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'tag',
    loadChildren: () => import('./pages/tag/tag-page.module').then(m => m.TagPageModule)
  },
  {
    path: 'produtos',
    loadChildren: () => import('./pages/produtos/produtos.module').then(m => m.ProdutosModule),
  },
  {
    path: 'cliente',
    loadChildren: () => import('./pages/cliente/cliente.module').then(m => m.ClienteModule)
  },
  {
    path: 'fornecedor',
    loadChildren: () => import('./pages/fornecedor/fornecedor.module').then(m => m.FornecedorModule)
  },
  {
    path: 'condicao-pagamento',
    loadChildren: () => import('./pages/condicao-pagamento/condicao-pagamento.module').then(m => m.CondicaoPagamentoModule)
  },
  {
    path: 'entrada-estoque',
    loadChildren: () => import('./pages/entrada-estoque/entrada-estoque.module').then(m => m.EntradaEstoqueModule)
  },
  {
    path: 'saida-estoque',
    loadChildren: () => import('../../shared/components/saida-estoque/saida-estoque.module').then(m => m.SaidaEstoqueModule)
  },
  {
    path: 'usuario',
    loadChildren: () => import('./pages/usuario/usuario.module').then(m => m.UsuarioModule)
  },
  {
    path: 'conta-pagar',
    loadChildren: () => import('./pages/conta-pagar/conta-pagar.module').then(m => m.ContaPagarModule)
  },
  {
    path: 'conta-receber',
    loadChildren: () => import('./pages/conta-receber/conta-receber.module').then(m => m.ContaReceberModule)
  },
  {
    path: 'quiosques',
    loadChildren: () => import('./pages/quiosque/quiosque.module').then(m => m.QuiosqueModule)
  },
  {
    path: 'agendamento-quiosque',
    loadChildren: () => import('./pages/agendamento-quiosque/agendamento-quiosque.module').then(m => m.AgendamentoQuiosqueModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'home'
  },
  
  {
    path: 'relatorios',
    loadChildren: () => import('./pages/relatorios/relatorios.module').then(m => m.RelatoriosModule)
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { bindToComponentInputs: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
