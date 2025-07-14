import { Injectable } from '../annotation/injectable';
import { NotificationRepository } from '../repository/notification.repository';
import { Notification } from '../entity/notification.entity';
import {UsuarioService} from './usuario.service';
import {UsuarioContext} from '../context/UsuarioContext';
import {UsuarioRepository} from '../repository/usuario.repository';

@Injectable()
export class NotificationService {

  constructor(
    private readonly notificationRepository: NotificationRepository,
    private usuarioRepository: UsuarioRepository,
  ) {}

  async add(notification: Notification) {
    const usuarios = await this.usuarioRepository.findAllUnlimited();

    const notifications: Notification[] = [];

    usuarios.forEach(usuario => {
      notifications.push({
        ...notification,
        usuario,
        read: UsuarioContext.instance.id == usuario.id,
        received: UsuarioContext.instance.id == usuario.id,
      })
    })

    await this.notificationRepository.saveAll(notifications);
  }

  async findAll() {
    return await this.notificationRepository.findAllUnlimited();
  }

  async countNotReadNotifications() {
    return await this.notificationRepository.countNotReadNotifications();
  }

  async markAllAsRead() {
    await this.notificationRepository.markAllAsRead();
  }

  async markAsRead(id: number) {
    await this.notificationRepository.update(id, [{ op: 'replace', path: '/read', value: true }]);
  }

  async markAllAsReceived() {
    await this.notificationRepository.markAllAsReceived();
  }

  async findAllNotReceived() {
    return await this.notificationRepository.findAllNotReceived()
      .then(notReceived => {
        this.markAllAsReceived();
        return notReceived;
      });
  }

}
