import { NgModule } from '@angular/core';

import { CardModule } from 'primeng/card';
import { SearchBarComponent } from "../searchcrudbar/search-bar.component";
import { DataTableComponent } from "../datatable/data-table.component";
import { ColumnComponent } from "../datatable/columns/column.component";
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { RouterModule, Routes } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { AvatarModule } from 'primeng/avatar';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ImageUploadComponent } from "../image-upload/image-upload.component";
import { CepService } from "../../services/cep.service";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { FormValidateMessageDirective } from "../../directive/form-validate-message-directive";
import { InputMaskModule } from 'primeng/inputmask';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { AutoFocus } from "primeng/autofocus";
import { ModalComponent } from "../modal/modal.component";
import { TagModule } from 'primeng/tag';
import { PopoverModule } from 'primeng/popover';
import { StepperModule } from 'primeng/stepper';
import {CrudDetailModule} from '../crud-detail/crud-detail.module';
import { UsuarioService } from '../../services/usuario.service';
import { PasswordModule } from 'primeng/password';
import { PerfilComponent } from './form/perfil.component';
import { RedefinirSenhaModule } from '../redefinir-senha/redefinir-senha.module';

@NgModule({
  imports: [
    CardModule,
    SearchBarComponent,
    DataTableComponent,
    ColumnComponent,
    ConfirmDialogModule,
    InputTextModule,
    ReactiveFormsModule,
    DividerModule,
    ButtonModule,
    InputNumberModule,
    AvatarModule,
    TableModule,
    CommonModule,
    FormsModule,
    ToastModule,
    DialogModule,
    ImageUploadComponent,
    FormValidateMessageDirective,
    InputMaskModule,
    ScrollPanelModule,
    AutoFocus,
    ModalComponent,
    TagModule,
    PopoverModule,
    StepperModule,
    CrudDetailModule,
    PasswordModule,
    RedefinirSenhaModule
  ],
  exports: [
    PerfilComponent
  ],
  declarations: [
    PerfilComponent
  ],
  providers: [
    UsuarioService,
    ConfirmationService,
    CepService,
    provideHttpClient(withInterceptorsFromDi())
  ]
})
export class PerfilModule {

}
