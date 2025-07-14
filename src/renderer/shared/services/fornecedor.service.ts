import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { from, Observable } from 'rxjs';
import { Page } from '../model/page.model';
import { Operation } from "fast-json-patch/commonjs/core";
import { Fornecedor } from "../model/fornecedor.model";
import { BaseService } from './base-service';

@Injectable()
export class FornecedorService extends BaseService {

  constructor(
    private electronService: ElectronService
  ) {
    super()
  }

  public save(fornecedor: Fornecedor) {
    return this.from(this.electronService.ipcRenderer.invoke('fornecedor:save', fornecedor));
  }

  public findAll(page = 1, limit = 10, search?: string): Observable<Page<Fornecedor>> {
    return this.from(this.electronService.ipcRenderer.invoke('fornecedor:findAll', page, limit, search));
  }

  public delete(id: number) {
    return this.from(this.electronService.ipcRenderer.invoke('fornecedor:delete', id));
  }

  public findById(id: number): Observable<Fornecedor> {
    return this.from(this.electronService.ipcRenderer.invoke('fornecedor:findById', id));
  }

  public update(id: number, operations: Operation[]): Observable<Fornecedor> {
    return this.from(this.electronService.ipcRenderer.invoke('fornecedor:update', id, operations));
  }

}
