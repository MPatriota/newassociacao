import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ElectronService } from 'ngx-electron';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonModule } from 'primeng/button';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';
import { BadgeModule } from 'primeng/badge';
import { HashLocationStrategy, LocationStrategy, NgOptimizedImage, registerLocaleData } from '@angular/common';
import { Menubar } from 'primeng/menubar';
import localePT from '@angular/common/locales/pt';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Card } from 'primeng/card';
import { FormValidateMessageDirective } from '../../shared/directive/form-validate-message-directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { Password } from 'primeng/password';
import { UsuarioService } from '../../shared/services/usuario.service';
import { PerfilModule } from '../../shared/components/perfil/perfil.module';
import { HeaderNotificationComponent } from '../../shared/components/header-notification/header-notification.component';
import {AssociacaoService} from '../../shared/services/associacao.service';
import { CrudDetailModule } from "../../shared/components/crud-detail/crud-detail.module";
import { ImageUploadComponent } from "../../shared/components/image-upload/image-upload.component";
import { InputMask } from "primeng/inputmask";
import { InputNumber } from "primeng/inputnumber";
import { ScrollPanel } from "primeng/scrollpanel";
import { Step, StepList, Stepper } from "primeng/stepper";

registerLocaleData(localePT);

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
        FontAwesomeModule,
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
        PerfilModule,
        HeaderNotificationComponent,
        CrudDetailModule,
        ImageUploadComponent,
        InputMask,
        InputNumber,
        ScrollPanel,
        Step,
        StepList,
        Stepper
    ],
  providers: [
    ElectronService,
    MessageService,
    ConfirmationService,
    provideAnimationsAsync(),
    providePrimeNG({ theme: { preset: Aura } }),
    { provide: LOCALE_ID, useValue: 'pt-br' },
    UsuarioService,
    AssociacaoService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
