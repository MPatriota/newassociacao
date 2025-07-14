import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { interval, Subscription, switchMap } from 'rxjs';
import { NotificationService } from '../../services/notification.service';
import { MessageService } from 'primeng/api';
import { Notification } from '../../model/notification.model';
import { NotificationEvent } from './NotificationEvents';

@Component({
  selector: 'app-notification',
  templateUrl: './header-notification.component.html',
  styleUrls: ['./header-notification.component.scss'],
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('slideDown', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ])
  ]
})
export class HeaderNotificationComponent implements OnInit {

  @ViewChild('notificationContainer') notificationContainer!: ElementRef;

  notifications: Notification[] = [];

  notificationCount = 0;

  popoverVisible = false;

  constructor(public notificationService: NotificationService,
              private messageService: MessageService) {

  }

  ngOnInit() {

    interval(5000)
      .pipe(switchMap(() => this.notificationService.findAllNotReceived()))
      .subscribe((notification: Notification[]) => {

        if (notification?.length) {

          this.popoverVisible = false;

          this.countNotRead();

          notification.forEach(notification => {

            this.messageService.add({
              severity: 'success',
              summary: notification.title,
              detail: notification.description,
              styleClass: 'custom-toast-notification',
              closable: true,
              life: 5000
            });

          })

          this.loadNotifications();
          NotificationEvent.newNotification.emit();
        }

      })

    this.countNotRead();

    this.setupScrollLock();

  }

  loadNotifications() {
    this.notificationService.getNotifications().subscribe(data => {
      return this.notifications = data;
    });
  }

  toggleNotifications(event: Event) {
    event.stopPropagation();

    this.popoverVisible = !this.popoverVisible;

    if (this.popoverVisible) this.loadNotifications();

  }

  closeNotifications() {
    this.popoverVisible = false;
  }

  execute(notification: Notification) {
    if (!notification.read) this.markAsRead(notification);
  }

  markAsRead(notification: Notification) {
    if (!notification.read) {
      this.notificationService.markAsRead(notification.id).subscribe(() => {
        notification.read = true;
        this.countNotRead();
      });
    }
  }

  markAllAsRead() {
    if (this.hasUnreadNotifications()) {
      this.notificationService.markAllAsRead().subscribe(() => {
        this.notifications.forEach(n => n.read = true);
        this.countNotRead();
      });
    }
  }

  hasUnreadNotifications(): boolean {
    return this.notificationCount > 0;
  }

  formatTime(date: Date): string {
    if (!date) return '';

    const notificationDate = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - notificationDate.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins} min atrás`;
    } else if (diffHours < 24) {
      return `${diffHours}h atrás`;
    } else if (diffDays < 7) {
      return `${diffDays}d atrás`;
    } else {
      return notificationDate.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      });
    }
  }

  trackByFn(index: number, notification: Notification): number {
    return notification.id;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (this.popoverVisible &&
      this.notificationContainer &&
      !this.notificationContainer.nativeElement.contains(event.target)) {
      this.closeNotifications();
    }
  }

  @HostListener('document:keydown.escape')
  onEscapePress() {
    if (this.popoverVisible) {
      this.closeNotifications();
    }
  }

  private setupScrollLock(): void {
    if (!document.getElementById('scroll-lock-style')) {
      const style = document.createElement('style');
      style.id = 'scroll-lock-style';
      style.textContent = `
        body.no-scroll {
          overflow: hidden;
          position: fixed;
          width: 100%;
          height: 100%;
        }
      `;
      document.head.appendChild(style);
    }
  }

  private countNotRead() {
    this.notificationService.countNotReadNotifications()
      .subscribe(count => {
        this.notificationCount = count;
      });
  }

}
