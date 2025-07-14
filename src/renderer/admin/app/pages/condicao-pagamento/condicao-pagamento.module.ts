import { NgModule } from '@angular/core';
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
import { CondicaoPagamentoListComponent } from './list/condicao-pagamento-list.component';
import { AvatarModule } from 'primeng/avatar';
import { StepperModule } from 'primeng/stepper';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ImageUploadComponent } from "../../../../shared/components/image-upload/image-upload.component";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { FormValidateMessageDirective } from "../../../../shared/directive/form-validate-message-directive";
import { InputMaskModule } from 'primeng/inputmask';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { AutoFocus } from "primeng/autofocus";
import { ModalComponent } from "../../../../shared/components/modal/modal.component";
import { SelectButtonModule } from 'primeng/selectbutton';
import { DocumentoFormatPipe } from "../../../../shared/pipe/documento-format.pipe";
import { TelefoneFormatPipe } from "../../../../shared/pipe/telefone-format.pipe";
import { SelectModule } from 'primeng/select';
import { CondicaoPagamentoService } from "../../../../shared/services/condicao-pagamento.service";
import { CondicaoPagamentoFormComponent } from "./form/condicao-pagamento-form.component";
import { TextareaModule } from 'primeng/textarea';
import { CheckboxModule } from 'primeng/checkbox';
import { DateService } from '../../../../shared/services/date.service';

const routes: Routes = [
  { path: '', component: CondicaoPagamentoListComponent },
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
        StepperModule,
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
        SelectButtonModule,
        DocumentoFormatPipe,
        TelefoneFormatPipe,
        SelectModule,
        TextareaModule,
        CheckboxModule,
    ],
  exports: [],
  declarations: [
    CondicaoPagamentoListComponent,
    CondicaoPagamentoFormComponent
  ],
  providers: [
    CondicaoPagamentoService,
    ConfirmationService,
    provideHttpClient(withInterceptorsFromDi()),
    DateService
  ]
})
export class CondicaoPagamentoModule {

}
