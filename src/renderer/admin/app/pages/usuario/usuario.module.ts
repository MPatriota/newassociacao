import { NgModule } from '@angular/core';
import { UsuarioFormComponent } from './form/usuario-form.component';

import { CardModule } from 'primeng/card';
import { SearchBarComponent } from "../../../../shared/components/searchcrudbar/search-bar.component";
import { DataTableComponent } from "../../../../shared/components/datatable/data-table.component";
import { ColumnComponent } from "../../../../shared/components/datatable/columns/column.component";
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { RouterModule, Routes } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { UsuarioListComponent } from './list/usuario-list.component';
import { AvatarModule } from 'primeng/avatar';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ImageUploadComponent } from "../../../../shared/components/image-upload/image-upload.component";
import { CepService } from "../../../../shared/services/cep.service";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { FormValidateMessageDirective } from "../../../../shared/directive/form-validate-message-directive";
import { InputMaskModule } from 'primeng/inputmask';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { AutoFocus } from "primeng/autofocus";
import { ModalComponent } from "../../../../shared/components/modal/modal.component";
import { TagModule } from 'primeng/tag';
import { PopoverModule } from 'primeng/popover';
import { StepperModule } from 'primeng/stepper';
import {CrudDetailModule} from '../../../../shared/components/crud-detail/crud-detail.module';
import { UsuarioService } from '../../../../shared/services/usuario.service';
import { PasswordModule } from 'primeng/password';
import { Checkbox } from "primeng/checkbox";
import { TagViewerComponent } from '../../../../shared/components/tag/tag-viewer.component';

const routes: Routes = [
  { path: '', component: UsuarioListComponent },
]

@NgModule({
  imports: [
    RouterModule.forChild(routes),
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
    Checkbox,
    TagViewerComponent
  ],
  exports: [],
  declarations: [
    UsuarioFormComponent,
    UsuarioListComponent
  ],
  providers: [
    UsuarioService,
    ConfirmationService,
    CepService,
    provideHttpClient(withInterceptorsFromDi())
  ]
})
export class UsuarioModule {

}
