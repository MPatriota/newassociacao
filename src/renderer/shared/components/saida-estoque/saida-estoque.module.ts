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
import { SaidaEstoqueListComponent } from './list/saida-estoque-list.component';
import { AvatarModule } from 'primeng/avatar';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ImageUploadComponent } from "../image-upload/image-upload.component";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { FormValidateMessageDirective } from "../../directive/form-validate-message-directive";
import { InputMaskModule } from 'primeng/inputmask';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { AutoFocus } from "primeng/autofocus";
import { ModalComponent } from "../modal/modal.component";
import { SelectButtonModule } from 'primeng/selectbutton';
import { DocumentoFormatPipe } from "../../pipe/documento-format.pipe";
import { TelefoneFormatPipe } from "../../pipe/telefone-format.pipe";
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { CheckboxModule } from 'primeng/checkbox';
import { SaidaEstoqueService } from "../../services/saida-estoque.service";
import { AutoComplete } from "primeng/autocomplete";
import { ProdutoService } from "../../services/produto.service";
import { DateFormatPipe } from "../../pipe/date-format.pipe";
import { CurrencyFormatPipe } from "../../pipe/currency-format.pipe";
import { FornecedorService } from "../../services/fornecedor.service";
import {DateService} from '../../services/date.service';
import {CrudDetailModule} from '../crud-detail/crud-detail.module';
import { DatePickerModule } from 'primeng/datepicker';
import {Step, StepList, Stepper} from 'primeng/stepper';
import {SaidaEstoqueFormComponent} from './form/saida-estoque-form.component';

const routes: Routes = [
  { path: '', component: SaidaEstoqueListComponent },
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
    Stepper
  ],
  exports: [],
  declarations: [
      SaidaEstoqueListComponent,
      SaidaEstoqueFormComponent
  ],
  providers: [
    SaidaEstoqueService,
    ConfirmationService,
    provideHttpClient(withInterceptorsFromDi()),
    ProdutoService,
    FornecedorService,
    DateService
  ]
})
export class SaidaEstoqueModule {

}
