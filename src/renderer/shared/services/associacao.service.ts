import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { BaseService } from './base-service';

@Injectable()
export class AssociacaoService extends BaseService {

  constructor(
    private electronService: ElectronService
  ) {
    super();
  }

  public find() {
    return this.from(this.electronService.ipcRenderer.invoke('associacao:find'));
  }

}
