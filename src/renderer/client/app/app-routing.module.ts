import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('../../shared/components/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'frente-caixa',
    loadChildren: () => import('./frente-caixa/frente-caixa.module').then(m => m.FrenteCaixaModule)
  },
  {
    path: 'saida-estoque',
    loadChildren: () => import('./../../shared/components/saida-estoque/saida-estoque.module').then(m => m.SaidaEstoqueModule)
  },
  {
    path: 'home',
    redirectTo: 'frente-caixa',
    pathMatch: 'full'
  },
  {
    path: '',
    redirectTo: 'frente-caixa',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'frente-caixa'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
