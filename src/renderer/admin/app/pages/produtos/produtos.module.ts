import { NgModule } from '@angular/core';
import { ProdutosListComponent } from './produtos-list.component';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CardModule } from 'primeng/card';
import { SearchBarComponent } from '../../../../shared/components/searchcrudbar/search-bar.component';
import { DataTableComponent } from '../../../../shared/components/datatable/data-table.component';
import { ColumnComponent } from '../../../../shared/components/datatable/columns/column.component';
import { TagViewerComponent } from '../../../../shared/components/tag/tag-viewer.component';
import { ButtonDirective, ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { PopoverModule } from 'primeng/popover';
import { ProdutoFormComponent } from './produto-create/produto-form.component';
import { PanelModule } from 'primeng/panel';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { StepsModule } from 'primeng/steps';
import { ImageCropperComponent } from 'ngx-image-cropper';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { TagDialogCreatorComponent } from '../../../../shared/components/tag/tag-creator/tag-dialog-creator.component';
import { TagService } from '../../../../shared/services/tag.service';
import { DialogModule } from 'primeng/dialog';
import { ChipModule } from 'primeng/chip';
import { ToolbarModule } from 'primeng/toolbar';
import { SplitterModule } from 'primeng/splitter';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FormValidateMessageDirective } from '../../../../shared/directive/form-validate-message-directive';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ProdutoService } from '../../../../shared/services/produto.service';
import { ImageUploadComponent } from '../../../../shared/components/image-upload/image-upload.component';
import { SidebarInsideComponent } from '../../../../shared/components/sidebar/sidebar-inside.component';
import { CheckboxModule } from 'primeng/checkbox';
import { SliderModule } from 'primeng/slider';
import { ImageModule } from 'primeng/image';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';

const routes: Routes = [
  {
    path: '',
    component: ProdutosListComponent,
  }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CardModule,
    FormsModule,
    SidebarInsideComponent,
    ImageModule,
    StepsModule,
    SliderModule,
    SelectButtonModule,
    CheckboxModule,
    ButtonModule,
    InputTextModule,
    InputTextModule,
    DividerModule,
    SelectModule,
    TextareaModule,
    ButtonModule,
    TagDialogCreatorComponent,
    TagViewerComponent,
    SearchBarComponent,
    DialogModule,
    ChipModule,
    ToolbarModule,
    SplitterModule,
    AutoCompleteModule,
    DataTableComponent,
    ConfirmDialogModule,
    ColumnComponent,
    PanelModule,
    ReactiveFormsModule,
    DropdownModule,
    FileUploadModule,
    SelectButtonModule,
    ImageUploadComponent,
    FormValidateMessageDirective,
    ModalComponent,
    InputNumberModule,
    ButtonDirective,
    TagModule,
    PopoverModule,
    NgOptimizedImage
  ],
  exports: [],
  declarations: [ProdutosListComponent, ProdutoFormComponent],
  providers: [TagService, ProdutoService],
})
export class ProdutosModule {
}
