import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { from } from 'rxjs';
import { BaseService } from './base-service';

@Injectable()
export class StatService extends BaseService {

  constructor(
    private electronService: ElectronService
  ) {
    super()
  }

  getStat() {
    return this.from(this.electronService.ipcRenderer.invoke('stat:get'));
  }

}
