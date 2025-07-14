import { Component, OnInit, ViewChild } from '@angular/core';
import { PageParameter } from '../../../../shared/model/page-parameter';
import { Tag } from '../../../../shared/model/tag.model';
import { Popover } from 'primeng/popover';
import { Page } from '../../../../shared/model/page.model';
import { Produto } from '../../../../shared/model/produto.model';
import { ProdutoService } from '../../../../shared/services/produto.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TagService } from '../../../../shared/services/tag.service';
import { normalizeSlug } from '../../../../shared/util/string.util';
import { FilterState } from '../../../../shared/model/filter.state';

@Component({
  selector: 'produtos-list',
  templateUrl: 'produtos-list.component.html',
  styleUrl: 'produtos-list.component.scss',
  standalone: false
})
export class ProdutosListComponent implements OnInit {

  @ViewChild('op') op!: Popover;

  page: Page<Produto> | null = {
    content: [],
    totalPages: 0,
    totalElements: 0,
    size: 0,
    number: 0,
    first: false,
    last: false
  } as any;

  filters: FilterState = this.defaultValueFilters;

  get defaultValueFilters() {
    return {
      valorMinimo: { value: null, callback: (value: any) => `,valor>=${value}`},
      valorMaximo: { value: null, callback: (value: any) => `,valor<=${value}`},
      estoqueMinimo: { value: null, callback: (value: any) => `,estoque>=${value}`},
      estoqueMaximo: { value: null, callback: (value: any) => `,estoque<=${value}`},
      types: { value: [], callback: (types: any[]) => `,tipo=in=(${types.join(',')})`},
      tags: { value: [], callback: (tags: any[]) => {
          return `tag.id=in=(${tags.map(tag => tag.id).join(',')})`
        }}
    };
  }

  tiposFiltro = [
    { label: 'Cantina', value: 'CANTINA' },
    { label: 'Material', value: 'MATERIAL' }
  ];

  tagsShown: Tag[] = [];

  showTag: boolean = false;

  pageParameters: PageParameter = new PageParameter();

  filteredTags: Tag[] = [];

  visibleCreate: boolean = false;

  editObject: Produto | undefined;

  private search: string | null = '';
  private advancedSearch: any | undefined = '';

  constructor(private _produtoService: ProdutoService,
              private _confirmationService: ConfirmationService,
              private _tagService: TagService,
              private _messageService: MessageService) {
  }

  ngOnInit(): void {
    this.loadData(this.pageParameters);
  }

  clearFilters() {
    this.filters = this.defaultValueFilters;
    this.applyFilters();
  }

  filterTags(event: any) {
    const query = event.query.toLowerCase();
    this._tagService.findAll(1, 15, this.getSearch(query))
      .subscribe(tagPage => this.filteredTags = tagPage.content);
  }

  getTagsToShow(content: Produto) {
    return content.tags.slice(0, 3).map(e => e.tag);
  }

  loadData(page: PageParameter) {
    this.pageParameters = page;
    this._produtoService.findAll(this.pageParameters.page, this.pageParameters.limit, this.advancedSearch ?? `nome=ilike=*${this.search}*`)
      .subscribe(page => this.page = page);
  }

  onShowAllTags(event: any, product: Produto) {
    this.tagsShown = product.tags.slice(3, product.tags.length).map(e => e.tag);
    this.showTag = !this.showTag;
    this.op.show(event);
  }

  goToNew() {
    this.editObject = undefined;
    this.visibleCreate = true;
  }

  onEdit(produto: Produto) {
    this.editObject = produto;
    this.visibleCreate = true;
  }

  applyFilters() {

    let statementModel: { statement: string, children: any[] } = {
      statement: `nome=ilike=*${this.search}*`,
      children: []
    }

    Object.keys(this.filters)
      .forEach((key: any) => {

        // @ts-ignore
        const filter: any = this.filters[key];

        if (filter.value && (!Array.isArray(filter.value) || filter.value.length > 0) && filter.callback && key !== 'tags') statementModel.statement += filter.callback(filter.value);

        if (filter.value && filter.callback && key === 'tags' && filter.value.length > 0) {

          statementModel.children?.push({
            statement: filter.callback(filter.value),
            alias: 'tags'
          });
        }

      });

    this.advancedSearch = statementModel;
    this.pageParameters = new PageParameter();
    this.loadData(this.pageParameters);
  }

  onSave() {
    this.loadData(this.pageParameters);
    this.editObject = undefined;
  }

  onSearch(search: string | null) {
    this.search = search || '';
    this.loadData(this.pageParameters);
  }

  onDelete(content: Produto) {
    this._confirmationService.confirm({
      header: 'Confirmação',
      message: 'Você tem certeza que deseja excluir esse produto?',
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

        if (content.id != null) {
          this._produtoService.delete(content.id).subscribe(() => {
            this._messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Produto excluido com sucesso'
            });
            this.pageParameters = new PageParameter();
            this.loadData(this.pageParameters);
          });
        }

      }
    });
  }

  private getSearch(query: string) {

    let searchValue: string | null = null;

    const idsOut = this.filters.tags.value.map((tag: Tag) => tag.id).join(',');

    if (idsOut !== '') {
      searchValue = `id=notin=(${idsOut})`;
    }

    if (query.trim() === '') {
      return searchValue;
    }

    const slug = normalizeSlug(query);

    return `${searchValue ? searchValue + ',' : ''}slug=like=${slug}*`;
  }

}
