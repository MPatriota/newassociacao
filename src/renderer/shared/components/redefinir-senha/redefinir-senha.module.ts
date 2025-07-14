import { NgModule } from '@angular/core';

import { CardModule } from 'primeng/card';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { ModalComponent } from "../modal/modal.component";
import { UsuarioService } from '../../services/usuario.service';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { FormValidateMessageDirective } from '../../directive/form-validate-message-directive';
import { RedefinirSenhaComponent } from './form/redefinir-senha.component';

@NgModule({
  imports: [
    CardModule,
    ReactiveFormsModule,
    ButtonModule,
    CommonModule,
    FormsModule,
    ModalComponent,
    PasswordModule,
    InputTextModule,
    FormValidateMessageDirective,
  ],
  exports: [
    RedefinirSenhaComponent
  ],
  declarations: [
    RedefinirSenhaComponent
  ],
  providers: [
    UsuarioService,
    provideHttpClient(withInterceptorsFromDi())
  ]
})
export class RedefinirSenhaModule {

}
