import { NgModule } from '@angular/core';

import { HomeComponent } from './home.component';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TimelineModule } from 'primeng/timeline';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { StatService } from '../../../../shared/services/stat.service';
import { CurrencyFormatPipe } from '../../../../shared/pipe/currency-format.pipe';
import { AgendamentoQuiosqueService } from '../../../../shared/services/agendamento-quiosque.service';

const uniqueRoute: Route = {
  path: '',
  component: HomeComponent,
}

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([uniqueRoute]),
    CardModule,
    ButtonModule,
    TimelineModule,
    TableModule,
    TagModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    CurrencyFormatPipe,
  ],
  exports: [],
  declarations: [HomeComponent],
  providers: [
    StatService,
    AgendamentoQuiosqueService
  ],
})
export class HomeModule {
}
