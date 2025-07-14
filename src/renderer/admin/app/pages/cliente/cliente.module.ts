import { NgModule } from '@angular/core';
import { ClienteFormComponent } from './form/cliente-form.component';
import { ClienteService } from '../../../../shared/services/cliente.service';
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
import { ClienteListComponent } from './list/cliente-list.component';
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

const routes: Routes = [
  { path: '', component: ClienteListComponent },
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
    CrudDetailModule
  ],
  exports: [],
  declarations: [
    ClienteFormComponent,
    ClienteListComponent
  ],
  providers: [
    ClienteService,
    ConfirmationService,
    CepService,
    provideHttpClient(withInterceptorsFromDi())
  ]
})
export class ClienteModule {

}
