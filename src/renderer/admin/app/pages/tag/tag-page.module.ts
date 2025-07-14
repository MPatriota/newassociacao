import { NgModule } from '@angular/core';

import { TagPageComponent } from './tag-page.component';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { ChipModule } from 'primeng/chip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OverlayModule } from 'primeng/overlay';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import { TagViewerComponent } from '../../../../shared/components/tag/tag-viewer.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { TagService } from '../../../../shared/services/tag.service';
import { DataTableComponent } from '../../../../shared/components/datatable/data-table.component';
import { ColumnComponent } from '../../../../shared/components/datatable/columns/column.component';
import { SearchBarComponent } from '../../../../shared/components/searchcrudbar/search-bar.component';
import { TagDialogCreatorComponent } from '../../../../shared/components/tag/tag-creator/tag-dialog-creator.component';

const uniqueRoute: Route = {
  path: '',
  component: TagPageComponent,
}

@NgModule({
  imports: [
    CommonModule,
    ToolbarModule,
    DialogModule,
    ReactiveFormsModule,
    OverlayModule,
    ColorPickerModule,
    TagModule,
    ButtonModule,
    PanelModule,
    ChipModule,
    InputTextModule,
    TagDialogCreatorComponent,
    CardModule,
    TagViewerComponent,
    FormsModule,
    DataTableComponent,
    SearchBarComponent,
    ConfirmDialogModule,
    RouterModule.forChild([uniqueRoute]),
    ColumnComponent
  ],
  exports: [],
  declarations: [TagPageComponent],
  providers: [ConfirmationService, TagService]
})
export class TagPageModule {
}
