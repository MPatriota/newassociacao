import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { from, Observable } from 'rxjs';
import { Page } from '../model/page.model';
import { Operation } from "fast-json-patch/commonjs/core";
import { FechamentoCaixa } from '../model/fechamento-caixa.model';
import { BaseService } from './base-service';

@Injectable()
export class FechamentoCaixaService extends BaseService {

  constructor(
    private electronService: ElectronService
  ) {
    super();
  }

  public save(fechamentoCaixa: FechamentoCaixa): Observable<FechamentoCaixa> {
    return this.from(this.electronService.ipcRenderer.invoke('fechamentoCaixa:save', fechamentoCaixa));
  }

  public findAll(page = 1, limit = 10, search?: string): Observable<Page<FechamentoCaixa>> {
    return this.from(this.electronService.ipcRenderer.invoke('fechamentoCaixa:findAll', page, limit, search));
  }

  public delete(id: number) {
    return this.from(this.electronService.ipcRenderer.invoke('fechamentoCaixa:delete', id));
  }

  public findById(id: number): Observable<FechamentoCaixa> {
    return this.from(this.electronService.ipcRenderer.invoke('fechamentoCaixa:findById', id));
  }

  public update(id: number, operations: Operation[]): Observable<FechamentoCaixa> {
    return this.from(this.electronService.ipcRenderer.invoke('fechamentoCaixa:update', id, operations));
  }

}
