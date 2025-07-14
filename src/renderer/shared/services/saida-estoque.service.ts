import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from '../model/page.model';
import { Operation } from "fast-json-patch/commonjs/core";
import { SaidaEstoque } from "../model/saida-estoque.model";
import {StatementSearchModel} from '../model/statement-search.model';
import { BaseService } from './base-service';
import { ElectronService } from 'ngx-electron';

@Injectable()
export class SaidaEstoqueService extends BaseService {

  constructor(
    private electronService: ElectronService
  ) {
    super();
  }

  public save(saidaEstoque: SaidaEstoque) {
    return this.from(this.electronService.ipcRenderer.invoke('saidaEstoque:save', saidaEstoque));
  }

  public findAll(page = 1, limit = 10, search?: string | StatementSearchModel): Observable<Page<SaidaEstoque>> {
    return this.from(this.electronService.ipcRenderer.invoke('saidaEstoque:findAll', page, limit, search));
  }

  public delete(id: number) {
    return this.from(this.electronService.ipcRenderer.invoke('saidaEstoque:delete', id));
  }

  public findById(id: number): Observable<SaidaEstoque> {
    return this.from(this.electronService.ipcRenderer.invoke('saidaEstoque:findById', id));
  }

  public update(id: number, operations: Operation[]): Observable<SaidaEstoque> {
    return this.from(this.electronService.ipcRenderer.invoke('saidaEstoque:update', id, operations));
  }

}
