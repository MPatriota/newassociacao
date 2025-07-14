import { IpcClass } from '../annotation/ipc-class';
import { NotificationService } from '../service/notification.service';
import { IpcMethod } from '../annotation/ipc-method';

@IpcClass("notification")
export class NotificationResource {

  constructor(private notificationService: NotificationService) {
  }

  @IpcMethod('findAll')
  async findAll() {
    return await this.notificationService.findAll();
  }

  @IpcMethod('markAsRead')
  async markAsRead(id: number) {
    await this.notificationService.markAsRead(id);
  }

  @IpcMethod('markAllAsRead')
  async markAllAsRead() {
    await this.notificationService.markAllAsRead();
  }

  @IpcMethod('countNotReadNotifications')
  async countNotReadNotifications() {
    return await this.notificationService.countNotReadNotifications();
  }

  @IpcMethod('findAllNotReceived')
  async findAllNotReceived() {
    return await this.notificationService.findAllNotReceived();
  }

}
