import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { from, Observable } from 'rxjs';
import { Page } from '../model/page.model';
import { Operation } from "fast-json-patch/commonjs/core";
import { CondicaoPagamento } from "../model/condicao-pagamento.model";
import moment from 'moment/moment';
import { DateService } from './date.service';
import { BaseService } from './base-service';

@Injectable()
export class CondicaoPagamentoService extends BaseService {

  constructor(
    private electronService: ElectronService,
    private dateService: DateService
  ) {
    super();
  }

  public save(condicaoPagamento: CondicaoPagamento) {
    return this.from(this.electronService.ipcRenderer.invoke('condicaoPagamento:save', condicaoPagamento));
  }

  public findAll(page = 1, limit = 10, search?: string): Observable<Page<CondicaoPagamento>> {
    return this.from(this.electronService.ipcRenderer.invoke('condicaoPagamento:findAll', page, limit, search));
  }

  public delete(id: number) {
    return this.from(this.electronService.ipcRenderer.invoke('condicaoPagamento:delete', id));
  }

  public findById(id: number): Observable<CondicaoPagamento> {
    return this.from(this.electronService.ipcRenderer.invoke('condicaoPagamento:findById', id));
  }

  public update(id: number, operations: Operation[]): Observable<CondicaoPagamento> {
    return this.from(this.electronService.ipcRenderer.invoke('condicaoPagamento:update', id, operations));
  }

  generateDates(condicaoPagamento: CondicaoPagamento) {
    if(!condicaoPagamento){
      return [];
    }

    const dates: Date[] = [];

    for (let i = 0; i < condicaoPagamento.parcelas; i++) {
      let date = this.dateService.getCurrentDate();

      if(i == 0) {
        date = moment(date).add(condicaoPagamento.vencimento, "days").toDate();
      } else {
        const previousDate = dates[i - 1];
        date = moment(previousDate).add(condicaoPagamento.intervalo, "days").toDate();
      }

      dates.push(date);
    }

    return dates;
  }

}
