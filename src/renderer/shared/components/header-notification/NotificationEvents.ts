import { EventEmitter } from '@angular/core';

export class NotificationEvent {
  public static newNotification = new EventEmitter<void>();
}
