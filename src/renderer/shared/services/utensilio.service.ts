import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { from, Observable } from 'rxjs';
import { Utensilio } from '../model/utensilio.model';
import { BaseService } from './base-service';

@Injectable()
export class UtensilioService extends BaseService {

  constructor(
    private electronService: ElectronService
  ) {
    super();
  }

  public save(utensilio: Utensilio): Observable<Utensilio> {
    return this.from(this.electronService.ipcRenderer.invoke('utensilio:save', utensilio));
  }

  public findAll(): Observable<Utensilio[]> {
    return this.from(this.electronService.ipcRenderer.invoke('utensilio:findAll'));
  }

}
