import { NgModule } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import {FrenteCaixaComponent} from './frente-caixa.component';
import {RouterModule, Routes} from '@angular/router';
import {CommonModule} from '@angular/common';
import {Button} from "primeng/button";
import { DividerModule } from 'primeng/divider';
import {CurrencyFormatPipe} from '../../../shared/pipe/currency-format.pipe';
import {ProdutoService} from '../../../shared/services/produto.service';
import {AutoComplete} from 'primeng/autocomplete';
import {FormValidateMessageDirective} from '../../../shared/directive/form-validate-message-directive';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ClienteService} from '../../../shared/services/cliente.service';
import { InputTextModule } from 'primeng/inputtext';
import {InputNumber} from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { CondicaoPagamentoService } from '../../../shared/services/condicao-pagamento.service';
import { VendaService } from '../../../shared/services/venda.service';
import { DateService } from '../../../shared/services/date.service';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { PanelModule } from 'primeng/panel';
import { SelectButton } from 'primeng/selectbutton';
import {
  AberturaFechamentoCaixaModule
} from "../abertura-fechamento-caixa/abertura-fechamento-caixa.module";
import { VendaDraftService } from '../../../shared/services/venda-draft.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import {TagService} from '../../../shared/services/tag.service';
import {TagViewerComponent} from '../../../shared/components/tag/tag-viewer.component';
import { AssociacaoService } from '../../../shared/services/associacao.service';
import { DateFormatPipe } from '../../../shared/pipe/date-format.pipe';
import { TimeFormatPipe } from '../../../shared/pipe/time-format.pipe';
import { Toast } from 'primeng/toast';
import { ConfiguracaoService } from '../../../shared/services/configuracao.service';
import { ConfirmDialog } from 'primeng/confirmdialog';

const routes: Routes = [
  {path: '', component: FrenteCaixaComponent}
]

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    Button,
    DividerModule,
    CurrencyFormatPipe,
    AutoComplete,
    FormValidateMessageDirective,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    InputNumber,
    ButtonModule,
    CardModule,
    ToolbarModule,
    PanelModule,
    SelectButton,
    AberturaFechamentoCaixaModule,
    TagViewerComponent,
    DateFormatPipe,
    TimeFormatPipe,
    CurrencyFormatPipe,
    Toast,
    ConfirmDialog
  ],
  declarations: [
    FrenteCaixaComponent,
  ],
  providers: [
    ElectronService,
    ProdutoService,
    ClienteService,
    CondicaoPagamentoService,
    VendaService,
    DateService,
    VendaDraftService,
    MessageService,
    TagService,
    AssociacaoService,
    ConfiguracaoService,
    ConfirmationService
  ],
})
export class FrenteCaixaModule {
}
