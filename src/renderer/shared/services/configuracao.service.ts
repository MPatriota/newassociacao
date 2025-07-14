import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { Observable } from 'rxjs';
import { Page } from '../model/page.model';
import { BaseService } from './base-service';


@Injectable()
export class ConfiguracaoService extends BaseService {

  constructor(
    private electronService: ElectronService
  ) {
    super();
  }

  public findAll(page = 1, limit = 10, search?: string): Observable<Page<any>> {
    return this.from(this.electronService.ipcRenderer.invoke('configuracao:findAll', page, limit, search));
  }

}
