import { NgModule } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutoFocus } from "primeng/autofocus";
import {FormValidateMessageDirective} from '../../directive/form-validate-message-directive';
import {CrudDetailColumnComponent} from './crud-detail-column.component';
import {CrudDetailComponent} from './crud-detail.component';

@NgModule({
  imports: [
    TableModule,
    CommonModule,
    ButtonModule,
    FormsModule,
    AutoFocus,
    InputTextModule,
    FormValidateMessageDirective
  ],
  exports: [
    CrudDetailComponent,
    CrudDetailColumnComponent
  ],
  declarations: [
    CrudDetailComponent,
    CrudDetailColumnComponent
  ],
  providers: [
  ]
})
export class CrudDetailModule {

}
