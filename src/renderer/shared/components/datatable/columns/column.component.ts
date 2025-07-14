import { Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { DataTableComponent } from '../data-table.component';

@Component({
  selector: 'column',
  template: ``
})
export class ColumnComponent {

  @ContentChild('body') bodyTemplate: TemplateRef<any> | undefined;

  @Input() field: string | undefined;
  @Input() header: string | undefined
  @Input() style: { [klass: string]: any } | null = null;

  constructor(private _dataTable: DataTableComponent) {
    this._dataTable.addColumn(this);
  }

}
