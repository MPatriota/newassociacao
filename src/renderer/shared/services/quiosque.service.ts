import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { from, Observable } from 'rxjs';
import { Page } from '../model/page.model';
import { Operation } from 'fast-json-patch/commonjs/core';
import { Quiosque } from '../model/quiosque.model';
import { BaseService } from './base-service';

@Injectable()
export class QuiosqueService extends BaseService {

  constructor(
    private electronService: ElectronService
  ) {
    super()
  }

  public findAll(page: number = 1,
                 limit: number = 10,
                 search?: any): Observable<Page<Quiosque>> {

    return this.from(this.electronService.ipcRenderer.invoke('quiosques:findAll', page, limit, search));
  }

  public save(quiosque: Quiosque) {
    return this.from(this.electronService.ipcRenderer.invoke('quiosques:save', quiosque));
  }

  public update(id: number, operations: Operation[]) {
    return this.from(this.electronService.ipcRenderer.invoke('quiosques:update', id, operations))
  }

  public findById(id: number): Observable<Quiosque> {
    return this.from(this.electronService.ipcRenderer.invoke('quiosques:findById', id));
  }

  public delete(id: number) {
    return this.from(this.electronService.ipcRenderer.invoke('quiosques:delete', id));
  }

}
