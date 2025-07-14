import { NgModule } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { AberturaFechamentoCaixaComponent} from './abertura-fechamento-caixa.component';
import {CommonModule} from '@angular/common';
import {Button} from "primeng/button";
import { DividerModule } from 'primeng/divider';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import {CurrencyFormatPipe} from '../../../shared/pipe/currency-format.pipe';
import {AutoComplete} from 'primeng/autocomplete';
import {FormValidateMessageDirective} from '../../../shared/directive/form-validate-message-directive';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import {InputNumber} from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { PanelModule } from 'primeng/panel';
import { SelectButton } from 'primeng/selectbutton';
import { CrudDetailModule } from '../../../shared/components/crud-detail/crud-detail.module';
import { ImageUploadComponent } from '../../../shared/components/image-upload/image-upload.component';
import { InputMask } from 'primeng/inputmask';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { Step, StepList, Stepper } from 'primeng/stepper';
import { AberturaCaixaService } from '../../../shared/services/abertura-caixa.service';
import { FechamentoCaixaService } from '../../../shared/services/fechamento-caixa.service';

@NgModule({
  imports: [
    CommonModule,
    Button,
    DividerModule,
    ScrollPanelModule,
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
    CrudDetailModule,
    ImageUploadComponent,
    InputMask,
    ModalComponent,
    Step,
    StepList,
    Stepper
  ],
  declarations: [
    AberturaFechamentoCaixaComponent,
  ],
  providers: [
    ElectronService,
    AberturaCaixaService,
    FechamentoCaixaService
  ],
  exports: [
    AberturaFechamentoCaixaComponent
  ]
})
export class AberturaFechamentoCaixaModule {
}
