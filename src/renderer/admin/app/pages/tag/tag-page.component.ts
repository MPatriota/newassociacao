import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Tag } from '../../../../shared/model/tag.model';
import { TagService } from '../../../../shared/services/tag.service';
import { Page } from '../../../../shared/model/page.model';
import { PageParameter } from '../../../../shared/model/page-parameter';

@Component({
  selector: 'tag',
  templateUrl: 'tag-page.component.html',
  standalone: false,
  styleUrl: 'tag-page.component.scss'
})
export class TagPageComponent implements OnInit {

  createVisible: boolean = false;

  readonly formTag: FormGroup;

  page: Page<Tag> | null = null;
  search: string = '';
  pageParameters: PageParameter = new PageParameter();

  constructor(
    private _confirmationService: ConfirmationService,
    private _tagService: TagService,
    private _messageService: MessageService) {

    this.formTag = new FormBuilder().group({
      id: [null],
      name: ['', Validators.required],
      color: ['', Validators.required]
    });

  }

  ngOnInit(): void {
    this.fetch();
  }

  onDeleteTag(item: Tag) {
    this._confirmationService.confirm({
      header: 'Confirmação',
      message: 'Você tem certeza que deseja excluir esta tag?',
      icon: 'pi pi-info-circle',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Deletar',
        severity: 'danger',
      },
      accept: () => {

        this._tagService.delete(item.id).subscribe(() => {
          this._messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Tag excluída com sucesso' });
          this.fetch();
        });

      }
    });
  }

  onEditTag(tag: Tag) {

    this.formTag.patchValue({
      id: tag.id,
      name: tag.name,
      color: tag.color
    });

    this.createVisible = true;

  }

  fetch() {

    this._tagService.findAll(this.pageParameters.page, this.pageParameters.limit, `name=ilike=*${this.search}*`)
      .subscribe(page => this.page = page);

  }

  onSearch(search: string | null) {
    this.search = search ?? '';
    this.fetch();
  }

  loadData(page: PageParameter) {
    this.pageParameters = page;
    this.fetch();
  }

}
