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
import { AvatarModule } from 'primeng/avatar';
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
import { TextareaModule } from 'primeng/textarea';
import { CheckboxModule } from 'primeng/checkbox';
import { AutoComplete } from "primeng/autocomplete";
import { ProdutoService } from "../../../../shared/services/produto.service";
import { DateFormatPipe } from "../../../../shared/pipe/date-format.pipe";
import { CurrencyFormatPipe } from "../../../../shared/pipe/currency-format.pipe";
import { FornecedorService } from "../../../../shared/services/fornecedor.service";
import {DateService} from '../../../../shared/services/date.service';
import {CrudDetailModule} from '../../../../shared/components/crud-detail/crud-detail.module';
import { DatePickerModule } from 'primeng/datepicker';
import {Step, StepList, Stepper} from 'primeng/stepper';
import { CondicaoPagamentoService } from '../../../../shared/services/condicao-pagamento.service';
import { ContaPagarListComponent } from './list/conta-pagar-list.component';
import { ContaPagarService } from '../../../../shared/services/conta-pagar.service';
import { ContaPagarFormComponent } from './form/conta-pagar-form.component';
import { Tooltip } from 'primeng/tooltip';
import { SidebarInsideComponent } from '../../../../shared/components/sidebar/sidebar-inside.component';
import { TagViewerComponent } from '../../../../shared/components/tag/tag-viewer.component';

const routes: Routes = [
  { path: '', component: ContaPagarListComponent },
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
    SelectButtonModule,
    DocumentoFormatPipe,
    TelefoneFormatPipe,
    SelectModule,
    TextareaModule,
    CheckboxModule,
    AutoComplete,
    DateFormatPipe,
    CurrencyFormatPipe,
    CrudDetailModule,
    DatePickerModule,
    Step,
    StepList,
    Stepper,
    Tooltip,
    SidebarInsideComponent,
    TagViewerComponent
  ],
  exports: [],
  declarations: [
    ContaPagarListComponent,
    ContaPagarFormComponent
  ],
  providers: [
    ContaPagarService,
    ConfirmationService,
    provideHttpClient(withInterceptorsFromDi()),
    ProdutoService,
    FornecedorService,
    DateService,
    CondicaoPagamentoService
  ]
})
export class ContaPagarModule {

}
