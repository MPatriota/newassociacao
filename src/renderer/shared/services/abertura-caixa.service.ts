import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { Observable } from 'rxjs';
import { Page } from '../model/page.model';
import { Operation } from "fast-json-patch/commonjs/core";
import { AberturaCaixa } from '../model/abertura-caixa.model';
import { BaseService } from './base-service';

@Injectable()
export class AberturaCaixaService extends BaseService {

  constructor(
    private electronService: ElectronService
  ) {
    super();
  }

  public save(aberturaCaixa: AberturaCaixa): Observable<AberturaCaixa> {
    return this.from(this.electronService.ipcRenderer.invoke('aberturaCaixa:save', aberturaCaixa));
  }

  public findAll(page = 1, limit = 10, search?: string): Observable<Page<AberturaCaixa>> {
    return this.from(this.electronService.ipcRenderer.invoke('aberturaCaixa:findAll', page, limit, search));
  }

  public delete(id: number) {
    return this.from(this.electronService.ipcRenderer.invoke('aberturaCaixa:delete', id));
  }

  public findById(id: number): Observable<AberturaCaixa> {
    return this.from(this.electronService.ipcRenderer.invoke('aberturaCaixa:findById', id));
  }

  public update(id: number, operations: Operation[]): Observable<AberturaCaixa> {
    return this.from(this.electronService.ipcRenderer.invoke('aberturaCaixa:update', id, operations));
  }

  public findLastOpened(): Observable<AberturaCaixa | undefined> {
    return this.from(this.electronService.ipcRenderer.invoke('aberturaCaixa:findLastOpened'));
  }
}
