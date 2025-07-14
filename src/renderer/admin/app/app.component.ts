import { Component, EventEmitter, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { UsuarioContext } from '../../shared/context/UsuarioContext';
import { Router } from '@angular/router';
import {ElectronService} from 'ngx-electron';
import {from} from 'rxjs';
import {AssociacaoService} from '../../shared/services/associacao.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  readonly UsuarioContext = UsuarioContext;
  menuItems: MenuItem[];
  formVisibleChange = new EventEmitter<number | undefined>;
  ajudaVisible = false;
  email = 'diegoh.silva16062019@gmail.com';

  constructor(
    private router: Router,
    private messageService: MessageService,
    private electronService: ElectronService,
    private associacaoService: AssociacaoService
  ) {
    this.menuItems = [
      {
        label: 'Início',
        icon: 'pi pi-home',
        routerLink: ['/home']
      },
      {
        label: 'Usuários',
        icon: 'pi pi-user',
        routerLink: ['/usuario']
      },
      {
        label: 'Produtos',
        icon: 'pi pi-shopping-cart',
        items: [
          {
            label: 'Ver Produtos',
            icon: 'pi pi-list',
            routerLink: ['/produtos']
          },
          {
            label: 'Marcadores',
            icon: 'pi pi-tag',
            routerLink: ['/tag']
          },
          {
            label: 'Entrada de Estoque',
            icon: 'pi pi-arrow-right',
            routerLink: ['/entrada-estoque']
          },
          {
            label: 'Saída de Estoque',
            icon: 'pi pi-arrow-left',
            routerLink: ['/saida-estoque']
          }
        ]
      },
      {
        label: 'Pessoas',
        icon: 'pi pi-users',
        items: [
          {
            label: 'Clientes',
            icon: 'pi pi-user',
            routerLink: ['/cliente']
          },
          {
            label: 'Fornecedores',
            icon: 'pi pi-truck',
            routerLink: ['/fornecedor']
          }
        ]
      },
      {
        label: 'Financeiro',
        icon: 'pi pi-dollar',
        items: [
          {
            label: 'Condições de Pagamento',
            icon: 'pi pi-credit-card',
            routerLink: ['/condicao-pagamento']
          },
          {
            label: 'Contas a Pagar',
            icon: 'pi pi-money-bill',
            routerLink: ['/conta-pagar']
          },
          {
            label: 'Contas a Receber',
            icon: 'pi pi-wallet',
            routerLink: ['/conta-receber']
          },
        ]
      },
      {
        label: 'Quiosque',
        icon: 'pi pi-building-columns',
        items: [
          {
            label: 'Cadastro de Quiosque',
            icon: 'pi pi-building-columns',
            routerLink: ['/quiosques']
          },
          {
            label: 'Agendamento de Quiosque',
            icon: 'pi pi-calendar',
            routerLink: ['/agendamento-quiosque']
          }
        ]
      },
      {
        label: 'Relatórios',
        icon: 'pi pi-chart-bar',
        routerLink: '/relatorios'
      }


    ];
  }

  ngOnInit(): void {
    if(!UsuarioContext.instance.isAuthenticated) {
      this.router.navigate(['/login']);
    }

    this.associacaoService.find().subscribe(associacao => {
      if(associacao) {
        document.title = associacao.nomeFantasia
      }
    })
  }

  visualizarPerfil() {
    const usuarioId = UsuarioContext.instance.id;

    if(usuarioId) {
      this.formVisibleChange.emit(usuarioId);
    }
  }

}
