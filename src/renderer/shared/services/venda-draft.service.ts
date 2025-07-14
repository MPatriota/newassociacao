import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { from, Observable } from 'rxjs';
import { Page } from '../model/page.model';
import { Operation } from "fast-json-patch/commonjs/core";
import { VendaDraft } from '../model/venda-draft.model';
import { BaseService } from './base-service';

@Injectable()
export class VendaDraftService extends BaseService {

  constructor(
    private electronService: ElectronService
  ) {
    super();
  }

  public save(vendaDraft: VendaDraft) {
    return this.from(this.electronService.ipcRenderer.invoke('vendaDraft:save', vendaDraft));
  }

  public findAll(page = 1, limit = 10, search?: string): Observable<Page<VendaDraft>> {
    return this.from(this.electronService.ipcRenderer.invoke('vendaDraft:findAll', page, limit, search));
  }

  public delete(id: number) {
    return this.from(this.electronService.ipcRenderer.invoke('vendaDraft:delete', id));
  }

  public findById(id: number): Observable<VendaDraft> {
    return this.from(this.electronService.ipcRenderer.invoke('vendaDraft:findById', id));
  }

  public update(id: number, operations: Operation[]): Observable<VendaDraft> {
    return this.from(this.electronService.ipcRenderer.invoke('vendaDraft:update', id, operations));
  }

}
