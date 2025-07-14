import { NgModule } from '@angular/core';
import { QuiosqueListComponent } from './quiosque-list.component';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { SearchBarComponent } from '../../../../shared/components/searchcrudbar/search-bar.component';
import { RouterModule, Routes } from '@angular/router';
import { QuiosqueFormComponent } from './quiosque-creator/quiosque-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { FileUploadModule } from 'primeng/fileupload';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CheckboxModule } from 'primeng/checkbox';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { InputSwitchModule } from 'primeng/inputswitch';
import {
  ImageUploadMultipleComponent
} from '../../../../shared/components/image-upload-multiple/image-upload-multiple.component';
import { UtensilioService } from '../../../../shared/services/utensilio.service';
import { QuiosqueService } from '../../../../shared/services/quiosque.service';
import { FormValidateMessageDirective } from '../../../../shared/directive/form-validate-message-directive';
import { GalleriaModule } from 'primeng/galleria';
import { PaginatorModule } from 'primeng/paginator';
import { AutoComplete } from 'primeng/autocomplete';
import { Divider } from 'primeng/divider';
import { SidebarInsideComponent } from '../../../../shared/components/sidebar/sidebar-inside.component';
import { TagViewerComponent } from '../../../../shared/components/tag/tag-viewer.component';
import { QuiosqueViewComponent } from './quiosque-view/quiosque-view.component';
import { CarouselModule } from 'primeng/carousel';

const routes: Routes = [
  {
    path: '',
    component: QuiosqueListComponent,
  },
  {
    path: ':id',
    component: QuiosqueFormComponent
  },
  {
    path: ':id/view',
    component: QuiosqueViewComponent
  }
]

@NgModule({
  imports: [
    CommonModule,
    SearchBarComponent,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    TextareaModule,
    CheckboxModule,
    SelectButtonModule,
    FileUploadModule,
    GalleriaModule,
    FormsModule,
    InputSwitchModule,
    ImageUploadMultipleComponent,
    PaginatorModule,
    ToastModule,
    IconFieldModule,
    FormValidateMessageDirective,
    InputIconModule,
    FontAwesomeModule,
    CarouselModule,
    ConfirmDialogModule,
    AutoComplete,
    Divider,
    SidebarInsideComponent,
    TagViewerComponent
  ],
  exports: [],
  declarations: [QuiosqueListComponent, QuiosqueFormComponent, QuiosqueViewComponent],
  providers: [
    ConfirmationService,
    UtensilioService,
    MessageService,
    ConfirmationService,
    QuiosqueService],
})
export class QuiosqueModule {
}
