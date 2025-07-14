import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { from, Observable } from 'rxjs';
import { Cliente } from '../model/cliente.model';
import { Page } from '../model/page.model';
import { Operation } from "fast-json-patch/commonjs/core";
import { BaseService } from './base-service';


@Injectable()
export class ClienteService extends BaseService {

  constructor(
    private electronService: ElectronService
  ) {
    super();
  }

  public save(cliente: Cliente) {
    return this.from(this.electronService.ipcRenderer.invoke('cliente:save', cliente));
  }

  public findAll(page = 1, limit = 10, search?: string): Observable<Page<Cliente>> {
    return this.from(this.electronService.ipcRenderer.invoke('cliente:findAll', page, limit, search));
  }

  public delete(id: number) {
    return this.from(this.electronService.ipcRenderer.invoke('cliente:delete', id));
  }

  public findById(id: number): Observable<Cliente> {
    return this.from(this.electronService.ipcRenderer.invoke('cliente:findById', id));
  }

  public update(id: number, operations: Operation[]): Observable<Cliente> {
    return this.from(this.electronService.ipcRenderer.invoke('cliente:update', id, operations));
  }

}
