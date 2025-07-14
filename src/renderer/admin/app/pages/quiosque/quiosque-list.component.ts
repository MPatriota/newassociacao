import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuiosqueService } from '../../../../shared/services/quiosque.service';
import { PageParameter } from '../../../../shared/model/page-parameter';
import { Page } from '../../../../shared/model/page.model';
import { Quiosque } from '../../../../shared/model/quiosque.model';
import { PaginatorState } from 'primeng/paginator';
import { faUtensils } from '@fortawesome/free-solid-svg-icons';
import { Cliente } from '../../../../shared/model/cliente.model';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'quiosque-list',
  standalone: false,
  templateUrl: 'quiosque-list.component.html',
  styleUrl: `quiosque-list.component.scss`
})
export class QuiosqueListComponent implements OnInit {

  pageParameters: PageParameter = new PageParameter(1, 5);

  page: Page<Quiosque> | null = {
    content: [],
    totalPages: 0,
    totalElements: 0,
    size: 0,
    number: 0,
    first: false,
    last: false
  } as any;

  status: any[]  = [
    { label: 'Alugado', value: 'ALUGADO' },
    { label: 'Disponível', value: 'DISPONIVEL' }
  ];

  constructor(
    private _router: Router,
    private quiosqueService: QuiosqueService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.loadData(this.pageParameters);
  }

  async goToNew() {
    await this._router.navigateByUrl('/quiosques/novo')
  }

  loadData(pageParameter: PageParameter) {
    this.pageParameters = pageParameter;
    this.quiosqueService.findAll(pageParameter.page, pageParameter.limit, '')
      .subscribe(page => this.page = page);
  }

  onPageChange(event: PaginatorState) {
    this.loadData(new PageParameter((event.page ?? 0) + 1, event.rows));
  }

  protected readonly faUtensils = faUtensils;

  clearFilters() {

  }

  delete(quiosque: Quiosque) {
    this.confirmationService.confirm({
      header: 'Confirmação',
      message: `Você tem certeza que deseja excluir o quiosque <b>${quiosque.nome}</b>?`,
      icon: 'pi pi-info-circle',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Deletar',
        severity: 'danger',
      },
      accept: () => {
        if(!quiosque.id){
          return;
        }

        this.quiosqueService.delete(quiosque.id).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Quiosque excluído com sucesso.' });
          this.loadData(this.pageParameters);
        });
      }
    });
  }
}
