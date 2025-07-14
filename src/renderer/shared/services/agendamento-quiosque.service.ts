import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { from, Observable } from 'rxjs';
import { Page } from '../model/page.model';
import { Operation } from "fast-json-patch/commonjs/core";
import {StatementSearchModel} from '../model/statement-search.model';
import { AgendamentoQuiosque } from '../model/agendamento-quiosque.model';
import { BaseService } from './base-service';

@Injectable()
export class AgendamentoQuiosqueService extends BaseService {

  constructor(
    private electronService: ElectronService
  ) {
    super();
  }

  public save(agendamentoQuiosque: AgendamentoQuiosque) {
    return this.from(this.electronService.ipcRenderer.invoke('agendamentoQuiosque:save', agendamentoQuiosque));
  }

  public findAll(page = 1, limit = 10, search?: string | StatementSearchModel): Observable<Page<AgendamentoQuiosque>> {
    return this.from(this.electronService.ipcRenderer.invoke('agendamentoQuiosque:findAll', page, limit, search));
  }

  public delete(id: number) {
    return this.from(this.electronService.ipcRenderer.invoke('agendamentoQuiosque:delete', id));
  }

  public findById(id: number): Observable<AgendamentoQuiosque> {
    return this.from(this.electronService.ipcRenderer.invoke('agendamentoQuiosque:findById', id));
  }

  public update(id: number, operations: Operation[]): Observable<AgendamentoQuiosque> {
    return this.from(this.electronService.ipcRenderer.invoke('agendamentoQuiosque:update', id, operations));
  }

  public findByQuiosque(quiosqueId: number, data: Date): Observable<AgendamentoQuiosque[]> {
    return this.from(this.electronService.ipcRenderer.invoke('agendamentoQuiosque:findByQuiosque', quiosqueId, data));
  }

  public findLast7Days(): Observable<AgendamentoQuiosque[]> {
    return this.from(this.electronService.ipcRenderer.invoke('agendamentoQuiosque:findLast7Days'));
  }

}
