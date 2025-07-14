import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { from, Observable } from 'rxjs';
import { Page } from '../model/page.model';
import { Operation } from "fast-json-patch/commonjs/core";
import { Venda } from '../model/venda.model';
import { RazaoFechamentoCaixa } from '../model/razao-fechamento-caixa.model';
import { BaseService } from './base-service';


@Injectable()
export class VendaService extends BaseService {

  constructor(
    private electronService: ElectronService
  ) {
    super()
  }

  public save(venda: Venda): Observable<Venda> {
    return this.from(this.electronService.ipcRenderer.invoke('venda:save', venda));
  }

  public findAll(page = 1, limit = 10, search?: string): Observable<Page<Venda>> {
    return this.from(this.electronService.ipcRenderer.invoke('venda:findAll', page, limit, search));
  }

  public delete(id: number) {
    return this.from(this.electronService.ipcRenderer.invoke('venda:delete', id));
  }

  public findById(id: number): Observable<Venda> {
    return this.from(this.electronService.ipcRenderer.invoke('venda:findById', id));
  }

  public update(id: number, operations: Operation[]): Observable<Venda> {
    return this.from(this.electronService.ipcRenderer.invoke('venda:update', id, operations));
  }

  public findRazoesFechamentoCaixa(idAberturaCaixa: number): Observable<RazaoFechamentoCaixa[]> {
    return this.from(this.electronService.ipcRenderer.invoke('venda:findRazoesFechamentoCaixa', idAberturaCaixa));
  }

}
