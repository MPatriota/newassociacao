import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../../../shared/services/notification.service';
import { Notification } from '../../../../shared/model/notification.model';
import { formatTime } from '../../../../shared/util/date-utils';
import { StatService } from '../../../../shared/services/stat.service';
import { UsuarioService } from '../../../../shared/services/usuario.service';
import { UsuarioContext } from '../../../../shared/context/UsuarioContext';
import { Usuario } from '../../../../shared/model/usuario.model';
import { CalendarEvent } from 'angular-calendar';
import { AgendamentoQuiosqueService } from '../../../../shared/services/agendamento-quiosque.service';
import moment from 'moment';
import { NotificationEvent } from '../../../../shared/components/header-notification/NotificationEvents';

@Component({
  selector: 'home',
  templateUrl: 'home.component.html',
  standalone: false,
  styleUrl: 'home.component.scss'
})
export class HomeComponent implements OnInit {

  currentDate: Date = new Date();

  recentActivities: Notification[] = [];

  stats: {
    totalVenda: number,
    quiosquesAlugados: number,
    quiosquerTotais: number,
    produtosEmEstoque: number,
    totalContasAReceber: number,
    totalContasPagar: number
  } = {
    totalVenda: 0,
    quiosquesAlugados: 0,
    quiosquerTotais: 0,
    produtosEmEstoque: 0,
    totalContasAReceber: 0,
    totalContasPagar: 0
  };

  usuario?: Usuario;
  events: CalendarEvent[] = [];

  constructor(
    private notificationService: NotificationService,
    private statService: StatService,
    private usuarioService: UsuarioService,
    private agendamentoQuiosqueService: AgendamentoQuiosqueService,
  ) { }

  ngOnInit() {
    NotificationEvent.newNotification.subscribe(() => {
      this.loadNotifications();
    })

    this.loadNotifications();
    this.getStats();

    this.usuarioService.findById(UsuarioContext.instance.id!).subscribe(usuario => {
      this.usuario = usuario;
    })

    this.agendamentoQuiosqueService.findLast7Days().subscribe(agendamentos => {
      this.events = agendamentos.map(agendamento => {
        return {
          start: moment(`${agendamento.data} ${agendamento.horaInicio}`, "YYYY-MM-DD HH:mm").toDate(),
          end: moment(`${agendamento.data} ${agendamento.horaFim}`, "YYYY-MM-DD HH:mm").toDate(),
          title: `Quiosque: ${agendamento.quiosque.nome} - Cliente: ${agendamento.cliente.nome}`
        }
      })
    })
  }

  loadNotifications() {
    this.notificationService.getNotifications().subscribe(notifications => {
      this.recentActivities = notifications;
    });
  }

  refreshNotifications() {
    this.notificationService.clearCache();
    this.loadNotifications();
  }

  refreshAllData() {
    this.getStats();
  }

  getNotificationColorClass(notification: Notification): string {
    if (notification.icon?.includes('pi-calendar')) {
      return 'event-notification';
    } else if (notification.icon?.includes('pi-exclamation-triangle')) {
      return 'alert-notification';
    } else if (notification.icon?.includes('pi-check-circle')) {
      return 'approval-notification';
    } else {
      return '';
    }
  }

  private getStats() {
    this.statService.getStat().subscribe(stat => this.stats = stat)
  }

  protected readonly formatTime = formatTime;
}
