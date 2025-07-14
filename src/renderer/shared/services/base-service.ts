import { MessageService } from 'primeng/api';
import { catchError, from, of } from 'rxjs';
import { inject } from '@angular/core';

export class BaseService {

  private messageService: MessageService;

  constructor() {
    this.messageService = inject(MessageService);
  }

  protected from(promise: Promise<any>) {
    return from(promise)
      .pipe(catchError(err => {
        const detail = err.message.split("Error:")[1].trim();
        this.messageService.add({ severity: 'error', summary: 'Erro', detail })

        return of();
      }))
  }
}
