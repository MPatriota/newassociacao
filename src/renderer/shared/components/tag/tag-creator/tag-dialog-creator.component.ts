import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonDirective } from 'primeng/button';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TagViewerComponent } from '../tag-viewer.component';
import { TagService } from '../../../services/tag.service';
import { compare } from 'fast-json-patch/commonjs/duplex';
import { Tag } from '../../../model/tag.model';
import { normalizeSlug } from '../../../util/string.util';
import { FormValidateMessageDirective } from '../../../directive/form-validate-message-directive';
import { ModalComponent } from '../../modal/modal.component';

@Component({
  selector: 'tag-dialog-creator',
  imports: [
    ButtonDirective,
    FormsModule,
    InputText,
    ModalComponent,
    FormValidateMessageDirective,
    ReactiveFormsModule,
    TagViewerComponent
  ],
  templateUrl: 'tag-dialog-creator.component.html',
  styles: `
    .color-picker {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      padding: 8px;
    }

    .color-dot {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      cursor: pointer;
      transition: transform 0.2s;
      border: 2px solid white;
      box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
    }

    .color-dot:hover {
      transform: scale(1.2);
    }

    .color-dot.selected {
      border: 2px solid #000;
      transform: scale(1.1);
    }

    .header-container {
      padding: 0.5rem;
      display: flex;
      align-items: center;
      width: 100%;
    }

    .title-section {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .title-section i {
      font-size: 1.4rem;
      color: var(--primary-color, #2196F3);
    }

    .panel-title {
      font-size: 1.3rem;
      font-weight: 600;
      color: var(--text-color, #495057);
      letter-spacing: 0.5px;
    }

    :host ::ng-deep .p-panel .p-panel-header {
      background-color: var(--surface-card, #ffffff);
      border-bottom: 1px solid var(--surface-border, #dee2e6);
      padding: 1rem;
    }

    ::ng-deep .p-dialog.tag-dialog {
      .p-dialog-header {
        padding: 1.25rem 1.5rem;
        border-bottom: 1px solid #dee2e6;
      }

      .p-dialog-content {
        padding: 0;
      }

      .p-dialog-footer {
        padding: 1rem 1.5rem;
        border-top: 1px solid #dee2e6;
      }

      .form-content {
        padding: 1.5rem;
      }

      input.p-inputtext {
        height: 38px;
      }

      label {
        font-size: 0.875rem;
        color: #495057;
      }

      small {
        color: #6c757d;
      }

      .p-button {
        &.p-button-text {
          color: #495057;

          &:hover {
            background: #f8f9fa;
          }
        }

        &.p-button-success {
          background: #4CAF50;
          border-color: #4CAF50;
          color: white;

          &:hover {
            background: #43a047;
            border-color: #43a047;
          }
        }
      }
    }
  `
})
export class TagDialogCreatorComponent {

  formTag: FormGroup = new FormBuilder().group({
    id: [null],
    name: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
    color: ['', Validators.required]
  });

  colors: string[] = [
    '#2196F3', '#673AB7', '#9C27B0', '#3F51B5', '#607D8B',
    '#009688', '#00BCD4', '#4CAF50', '#8BC34A', '#FFC107',
    '#FF9800', '#FF5722', '#F44336', '#E91E63', '#9E9E9E'
  ];
  @Input() visible: boolean = false;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter();
  @Output() onChange: EventEmitter<void> = new EventEmitter();

  originalValue: Tag | undefined;

  constructor(
    private _tagService: TagService,
    private _confirmationService: ConfirmationService,
    private _messageService: MessageService) {
  }

  @Input() set formTagValue(value: FormGroup) {
    this.originalValue = value.value;
    this.formTag = value;
  }

  selectColor(color: string) {
    this.formTag.patchValue({ color });
  }

  onSaveTag() {

    this._tagService.findBySlug(normalizeSlug(this.formTag.get('name')?.value))
      .subscribe((tag) => {

        if (tag && tag.id != this.formTag.get("id")?.value) {
          this._confirmationService.confirm({
            header: 'Confirmação',
            icon: 'pi pi-info-circle',
            rejectButtonProps: {
              label: 'Cancelar',
              severity: 'secondary',
              outlined: true,
            },
            acceptButtonProps: {
              label: 'Aceitar',
              severity: 'success',
            },
            message: 'Um marcador com este nome já existe no sistema. Deseja atualizar ou reativar esta tag?',
            accept: () => this.save(tag),
            reject: () => {
              this.formTag.reset();
            }
          });
        } else {
          this.save();
        }

      });

  }

  private save(tag?: Tag) {

    this.visible = false;

    if (tag) {

      this.formTag.get('id')?.setValue(tag.id);

      const operations = compare(tag, this.formTag.value);

      this._tagService.update(tag.id, operations).subscribe(() => {
        this._messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Tag atualizada com sucesso' });
        this.afterSave();
      });

      return;
    }

    if (this.formTag.get('id')?.value && this.originalValue) {

      const operations = compare(this.originalValue, this.formTag.value);

      this._tagService.update(this.formTag.get('id')?.value, operations).subscribe(() => {
        this._messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Tag atualizada com sucesso' });
        this.afterSave();
      });

      return;
    }

    this._tagService.save(this.formTag.value).subscribe(() => {
      this._messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Tag salva com sucesso' });
      this.afterSave();
    });
  }

  private afterSave() {
    this.formTag.reset();
    this.onChange.emit();
    this.visibleChange.emit(this.visible);
  }

}
