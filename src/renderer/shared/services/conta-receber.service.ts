import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { from, Observable } from 'rxjs';
import { Page } from '../model/page.model';
import { Operation } from "fast-json-patch/commonjs/core";
import {StatementSearchModel} from '../model/statement-search.model';
import { ContaReceber } from '../model/conta-receber.model';
import { BaseService } from './base-service';

@Injectable()
export class ContaReceberService extends BaseService {

  constructor(
    private electronService: ElectronService
  ) {
    super();
  }

  public save(contaReceber: ContaReceber) {
    return this.from(this.electronService.ipcRenderer.invoke('contaReceber:save', contaReceber));
  }

  public findAll(page = 1, limit = 10, search?: string | StatementSearchModel): Observable<Page<ContaReceber>> {
    return this.from(this.electronService.ipcRenderer.invoke('contaReceber:findAll', page, limit, search));
  }

  public delete(id: number) {
    return this.from(this.electronService.ipcRenderer.invoke('contaReceber:delete', id));
  }

  public findById(id: number): Observable<ContaReceber> {
    return this.from(this.electronService.ipcRenderer.invoke('contaReceber:findById', id));
  }

  public update(id: number, operations: Operation[]): Observable<ContaReceber> {
    return this.from(this.electronService.ipcRenderer.invoke('contaReceber:update', id, operations));
  }

}
