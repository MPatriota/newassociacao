import { Component, EventEmitter, OnInit } from '@angular/core';
import { UsuarioContext } from '../../shared/context/UsuarioContext';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

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

  constructor(
    private router: Router
  ) {
    this.menuItems = [
      {
        label: 'Frente de Caixa',
        icon: 'pi pi-home',
        routerLink: ['/frente-caixa']
      },
      {
        label: 'Saída de Estoque',
        icon: 'pi pi-arrow-left',
        routerLink: ['/saida-estoque']
      }
    ];
  }

  ngOnInit(): void {
    if(!UsuarioContext.instance.isAuthenticated) {
      this.router.navigate(['/login']);
    }
  }

  visualizarPerfil() {
    const usuarioId = UsuarioContext.instance.id;

    if(usuarioId) {
      this.formVisibleChange.emit(usuarioId);
    }
  }

}
