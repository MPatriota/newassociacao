import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { from, Observable } from 'rxjs';
import { Page } from '../model/page.model';
import { Operation } from "fast-json-patch/commonjs/core";
import { EntradaEstoque } from "../model/entrada-estoque.model";
import {StatementSearchModel} from '../model/statement-search.model';
import { BaseService } from './base-service';

@Injectable()
export class EntradaEstoqueService extends BaseService {

  constructor(
    private electronService: ElectronService
  ) {
    super()
  }

  public save(entradaEstoque: EntradaEstoque) {
    return this.from(this.electronService.ipcRenderer.invoke('entradaEstoque:save', entradaEstoque));
  }

  public findAll(page = 1, limit = 10, search?: string | StatementSearchModel): Observable<Page<EntradaEstoque>> {
    return this.from(this.electronService.ipcRenderer.invoke('entradaEstoque:findAll', page, limit, search));
  }

  public delete(id: number) {
    return this.from(this.electronService.ipcRenderer.invoke('entradaEstoque:delete', id));
  }

  public findById(id: number): Observable<EntradaEstoque> {
    return this.from(this.electronService.ipcRenderer.invoke('entradaEstoque:findById', id));
  }

  public update(id: number, operations: Operation[]): Observable<EntradaEstoque> {
    return this.from(this.electronService.ipcRenderer.invoke('entradaEstoque:update', id, operations));
  }

}
