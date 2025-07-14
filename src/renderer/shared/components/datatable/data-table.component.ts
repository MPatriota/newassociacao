import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ColumnComponent } from './columns/column.component';
import { TableModule, TablePageEvent } from 'primeng/table';
import { PageParameter } from '../../model/page-parameter';
import * as pageModel from '../../model/page.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'data-table',
  templateUrl: 'data-table.component.html',
  imports: [
    CommonModule,
    TableModule
  ]
})
export class DataTableComponent {

  get columnsLength() {
    return this.columns.length;
  }

  @Input({ required: true }) page: pageModel.Page<any> | null = {
    content: [],
    first: true,
    last: true,
    number: 0,
    numberOfElements: 0,
    size: 0,
    totalElements: 0,
    totalPages: 0,
    empty: true
  } as pageModel.Page<any>;

  @Output() onPageChange: EventEmitter<PageParameter> = new EventEmitter();

  pageParameters: PageParameter = new PageParameter();

  columns: ColumnComponent[] = [];

  addColumn(datatable: ColumnComponent) {
    this.columns.push(datatable);
  }

  loadData({first, rows}: TablePageEvent) {
    const page = (first / rows) + 1;
    this.pageParameters = new PageParameter(page, rows);
    this.onPageChange.emit(this.pageParameters);
  }

}
