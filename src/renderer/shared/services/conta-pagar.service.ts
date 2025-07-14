import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { from, Observable } from 'rxjs';
import { Page } from '../model/page.model';
import { Operation } from "fast-json-patch/commonjs/core";
import {StatementSearchModel} from '../model/statement-search.model';
import { ContaPagar } from '../model/conta-pagar.model';
import { BaseService } from './base-service';

@Injectable()
export class ContaPagarService extends BaseService {

  constructor(
    private electronService: ElectronService
  ) {
    super();
  }

  public save(contaPagar: ContaPagar) {
    return this.from(this.electronService.ipcRenderer.invoke('contaPagar:save', contaPagar));
  }

  public findAll(page = 1, limit = 10, search?: string | StatementSearchModel): Observable<Page<ContaPagar>> {
    return this.from(this.electronService.ipcRenderer.invoke('contaPagar:findAll', page, limit, search));
  }

  public delete(id: number) {
    return this.from(this.electronService.ipcRenderer.invoke('contaPagar:delete', id));
  }

  public findById(id: number): Observable<ContaPagar> {
    return this.from(this.electronService.ipcRenderer.invoke('contaPagar:findById', id));
  }

  public update(id: number, operations: Operation[]): Observable<ContaPagar> {
    return this.from(this.electronService.ipcRenderer.invoke('contaPagar:update', id, operations));
  }

}
