import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { from, Observable } from 'rxjs';
import { Page } from '../model/page.model';
import { Produto } from '../model/produto.model';
import { Operation } from 'fast-json-patch/commonjs/core';
import { BaseService } from './base-service';

@Injectable()
export class ProdutoService extends BaseService {

  constructor(
    private electronService: ElectronService
  ) {
    super()
  }

  public findAll(page: number = 1,
                 limit: number = 10,
                 search?: any): Observable<Page<Produto>> {

    return this.from(this.electronService.ipcRenderer.invoke('produtos:findAll', page, limit, search));
  }

  public save(produto: Produto) {
    return this.from(this.electronService.ipcRenderer.invoke('produtos:save', produto));
  }

  public update(id: number, operations: Operation[]) {
    return this.from(this.electronService.ipcRenderer.invoke('produtos:update', id, operations))
  }

  public findById(id: number) {
    return this.from(this.electronService.ipcRenderer.invoke('produtos:findById', id));
  }

  public delete(id: number) {
    return this.from(this.electronService.ipcRenderer.invoke('produtos:delete', id));
  }

}
