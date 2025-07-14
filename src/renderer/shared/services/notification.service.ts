import { Injectable } from '@angular/core';
import { from, Observable, of, tap } from 'rxjs';
import { Notification } from '../model/notification.model';
import { ElectronService } from 'ngx-electron';
import { Page } from '../model/page.model';
import { BaseService } from './base-service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService extends BaseService {

  private cache: Observable<any> | undefined;

  constructor(
    private electronService: ElectronService
  ) {
    super()
  }

  getNotifications(): Observable<Notification[]> {

    return this.from(this.electronService.ipcRenderer.invoke('notification:findAll'))
      .pipe(tap(notifications => this.cache = of(notifications)));
  }

  markAsRead(id: number): Observable<any> {
    return this.from(this.electronService.ipcRenderer.invoke('notification:markAsRead', id))
      .pipe(tap(() => this.cache = undefined));
  }

  markAllAsRead(): Observable<any> {
    return this.from(this.electronService.ipcRenderer.invoke('notification:markAllAsRead'))
      .pipe(tap(() => this.cache = undefined));
  }

  countNotReadNotifications() {
    return this.from(this.electronService.ipcRenderer.invoke('notification:countNotReadNotifications'));
  }

  findAllNotReceived() {
    return this.from(this.electronService.ipcRenderer.invoke('notification:findAllNotReceived'));
  }

  clearCache() {
    this.cache = undefined;
  }
}
