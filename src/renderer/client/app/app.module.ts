import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ElectronService } from 'ngx-electron';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {providePrimeNG} from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';
import { BadgeModule } from 'primeng/badge';
import { NgOptimizedImage } from '@angular/common';
import { Menubar } from 'primeng/menubar';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Card } from 'primeng/card';
import { FormValidateMessageDirective } from '../../shared/directive/form-validate-message-directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { Password } from 'primeng/password';
import { PerfilModule } from '../../shared/components/perfil/perfil.module';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UsuarioService } from '../../shared/services/usuario.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    ButtonModule,
    RippleModule,
    AvatarModule,
    TooltipModule,
    BadgeModule,
    NgOptimizedImage,
    Menubar,
    ToastModule,
    ConfirmDialog,
    Card,
    FormValidateMessageDirective,
    FormsModule,
    InputText,
    ModalComponent,
    Password,
    ReactiveFormsModule,
    PerfilModule
  ],
  providers: [
    ElectronService,
    MessageService,
    ConfirmationService,
    provideAnimationsAsync(),
    providePrimeNG({ theme: { preset: Aura } }),
    { provide: LOCALE_ID, useValue: 'pt-br' },
    UsuarioService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
