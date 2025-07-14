import { NgModule } from '@angular/core';

import { CardModule } from 'primeng/card';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { ModalComponent } from "../modal/modal.component";
import { UsuarioService } from '../../services/usuario.service';
import { PasswordModule } from 'primeng/password';
import { LoginComponent } from './form/login.component';
import { InputTextModule } from 'primeng/inputtext';
import { FormValidateMessageDirective } from '../../directive/form-validate-message-directive';
import { RedefinirSenhaModule } from "../redefinir-senha/redefinir-senha.module";

const routes: Routes = [
  { path: '', component: LoginComponent },
]

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        CardModule,
        ReactiveFormsModule,
        ButtonModule,
        CommonModule,
        FormsModule,
        ModalComponent,
        PasswordModule,
        InputTextModule,
        FormValidateMessageDirective,
        RedefinirSenhaModule,
    ],
  exports: [],
  declarations: [
    LoginComponent
  ],
  providers: [
    UsuarioService,
    provideHttpClient(withInterceptorsFromDi())
  ]
})
export class LoginModule {

}
