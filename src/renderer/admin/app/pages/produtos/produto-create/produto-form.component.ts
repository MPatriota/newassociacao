import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { Popover } from 'primeng/popover';
import { Tag } from '../../../../../shared/model/tag.model';
import { ProdutoForm } from '../form/produto-form';
import { FormBuilder } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProdutoService } from '../../../../../shared/services/produto.service';
import * as produtoModel from '../../../../../shared/model/produto.model';
import { Produto, ProdutoTag } from '../../../../../shared/model/produto.model';
import { ImageUploadComponent } from "../../../../../shared/components/image-upload/image-upload.component";
import { compare } from 'fast-json-patch/commonjs/duplex';
import { TagService } from '../../../../../shared/services/tag.service';
import { normalizeSlug } from '../../../../../shared/util/string.util';

@Component({
  selector: 'produto-create',
  templateUrl: 'produto-form.component.html',
  styleUrl: 'produto-form.component.scss',
  standalone: false
})
export class ProdutoFormComponent {

  @ViewChild('op') op!: Popover;
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('imageUpload') imageUpload!: ImageUploadComponent;

  produtoForm: ProdutoForm;

  private originalValue: Produto | undefined;

  @Input() set defaultProduto(produtoOutside: produtoModel.Produto | undefined) {
    if (produtoOutside?.id) {

      this._produtoService.findById(produtoOutside.id).subscribe(produto => {
        this.originalValue = produto;
        this.imageUpload.defineImage(produto.imagem);
        this.produtoForm.defaultValue = produto;
      });

    }
  }

  filteredTags: ProdutoTag[] = [];

  createTagVisible = false;

  @Input({ required: true }) visibleCreate!: boolean;

  @Output() onSave: EventEmitter<void> = new EventEmitter<void>();
  @Output() onClose: EventEmitter<void> = new EventEmitter<void>();
  @Output() visibleCreateChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  readonly types = [
    {
      name: produtoModel.TipoProduto.CANTINA,
      value: 'CANTINA'
    },
    {
      name: produtoModel.TipoProduto.MATERIAL,
      value: 'MATERIAL'
    }
  ]

  constructor(private _fb: FormBuilder,
              private _messageService: MessageService,
              private _tagService: TagService,
              private _confirmationService: ConfirmationService,
              private _produtoService: ProdutoService) {

    this.produtoForm = new ProdutoForm(this._fb);

  }

  save() {

    if (!this.produtoForm.isNew && this.originalValue) {

      const operations = compare(this.originalValue, this.produtoForm.payload(this.imageUpload.base64Image));

      this._produtoService.update(this.produtoForm.id, operations).subscribe(() => {
        this.close();
        this.onSave.emit();
        this._messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Produto editado com sucesso' });
      });

      return;
    }

    this._produtoService.save(this.produtoForm.payload(this.imageUpload.base64Image))
      .subscribe(() => {
        this.close();
        this.onSave.emit();
        this._messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Produto salvo com sucesso' });
      });

  }

  filterTags(event: any) {
    const query = event.query.toLowerCase();
    this._tagService.findAll(1, 15, this.getSearch(query))
      .subscribe(tagPage => this.filteredTags = tagPage.content.map(tag => ({ tag: tag }) as ProdutoTag));
  }

  private getSearch(query: string) {

    let searchValue: string | null = null;

    const idsOut = this.produtoForm.tags.map((tag: { tag: { id: any; }; }) => tag.tag.id).join(',');

    if (idsOut !== '') {
      searchValue = `id=notin=(${idsOut})`;
    }

    if (query.trim() === '') {
      return searchValue;
    }

    const slug = normalizeSlug(query);

    return `${searchValue ? searchValue + ',' : ''}slug=like=${slug}*`;
  }

  hideDialog() {

    if (this.produtoForm.form.dirty) {

      this._confirmationService.confirm({
        header: 'Confirmação',
        message: 'Há dados não salvos pendentes, tem certeza que deseja cancelar?',
        icon: 'pi pi-info-circle',
        rejectButtonProps: {
          label: 'Cancelar',
          severity: 'secondary',
          outlined: true,
        },
        acceptButtonProps: {
          label: 'Sim',
          severity: 'danger',
        },
        accept: () => {
          this.close();
        }
      });

      return;
    }

    this.close();
  }

  private close() {
    this.visibleCreate = false;
    this.visibleCreateChange.emit(this.visibleCreate);
    this.onClose.emit();
    this.produtoForm = new ProdutoForm(this._fb);
    this.clearReferences();
    this.originalValue = undefined;
  }

  private clearReferences() {
    this.produtoForm.image = undefined;
    this.imageUpload.croppedImage = undefined;
    this.imageUpload.imageChangedEvent = null;
    this.imageUpload.base64Image = undefined;
  }

  removeTag(tag: any, event: MouseEvent) {
    event.stopPropagation();
    this.produtoForm.form.get('tags')?.patchValue(this.produtoForm.tags.filter((p: any) => p != tag));
  }

}
