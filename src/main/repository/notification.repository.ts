import { AbstractRepository } from './repository';
import { Notification } from '../entity/notification.entity';
import { Injectable } from '../annotation/injectable';
import { UsuarioContext } from '../context/UsuarioContext';

@Injectable()
export class NotificationRepository extends AbstractRepository<Notification> {

  constructor() {
    super(Notification);
  }

  async countNotReadNotifications() {
    return this.repository.count({
      where: {
        read: false,
        usuario: {
          id: UsuarioContext.instance.id
        }
      }
    });
  }

  override async findAllUnlimited() {
    return this.repository.find({
      where: {
        usuario: {
          id: UsuarioContext.instance.id
        }
      },
      order: { createdAt: 'DESC' }
    });
  }

  async markAllAsRead() {
    const notificationsNotRead = await this.repository.findBy(      {
      read: false,
      usuario: {
        id: UsuarioContext.instance.id
      }
    });

    if(notificationsNotRead.length) {
      notificationsNotRead.forEach(notification => notification.read = true);

      await this.saveAll(notificationsNotRead);
    }
  }

  async findAllNotReceived() {
    return await this.repository.find({
      where: {
        received: false,
        usuario: {
          id: UsuarioContext.instance.id
        }
      },
      order: { createdAt: 'DESC' }
    });
  }

  async markAllAsReceived() {
    const notificationsNotReceived = await this.repository.findBy({
      received: false,
      usuario: {
        id: UsuarioContext.instance.id
      }
    });

    if(notificationsNotReceived.length) {
      notificationsNotReceived.forEach(notification => notification.received = true);

      await this.saveAll(notificationsNotReceived);
    }
  }
}
