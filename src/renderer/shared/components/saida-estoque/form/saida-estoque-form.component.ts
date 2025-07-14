import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { ConfirmationService, MessageService } from "primeng/api";
import { getOperations, removeNullOrUndefinedProperties } from "../../../util/json.util";
import { SaidaEstoque } from "../../../model/saida-estoque.model";
import { SaidaEstoqueService } from "../../../services/saida-estoque.service";
import { Produto } from "../../../model/produto.model";
import { ProdutoService } from "../../../services/produto.service";
import { AutoCompleteCompleteEvent } from "primeng/autocomplete";

@Component({
    selector: 'saida-estoque-form',
    templateUrl: 'saida-estoque-form.component.html',
    standalone: false
})
export class SaidaEstoqueFormComponent implements OnInit {

  @Input() isVisibleChange!: EventEmitter<number | undefined>;
  @Output() onSave = new EventEmitter<void>;

  form!: FormGroup;
  isVisible = false;
  originalValue?: SaidaEstoque;
  produtosSelect: Produto[] = []

  constructor (
    private saidaEstoqueService: SaidaEstoqueService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private produtoService: ProdutoService,
  ) {}

  ngOnInit() {
    this.createForm();

    if(this.isVisibleChange){
      this.isVisibleChange.subscribe(id => {
        this.createForm();
        this.isVisible = true;
        this.configureForm(id);
      })
    }
  }

  private createForm() {
    this.form = this.fb.group({
      id: [undefined],
      produto: [null, Validators.required],
      quantidade: [1, Validators.compose([Validators.min(1), Validators.required])],
      requisitante: ['', Validators.compose([Validators.required, Validators.max(100)])],
      observacao: ['', Validators.max(500)],
    })

  }

  private configureForm(id?: number) {
    if(id){
      this.saidaEstoqueService.findById(id).subscribe(foundSaidaEstoque => {
        this.setFoundSaidaEstoqueFormValue(foundSaidaEstoque)
      })
    }
  }

  private clearReferences() {
    this.originalValue = undefined;
  }

  private setFoundSaidaEstoqueFormValue(saidaEstoque: SaidaEstoque) {
    this.form.patchValue(saidaEstoque);
    this.originalValue = saidaEstoque;
  }

  save() {
    if(this.form.invalid){
      return;
    }

    const saidaEstoque: SaidaEstoque = this.form.getRawValue();

    if(this.originalValue) {
      const operations = getOperations(this.originalValue, saidaEstoque);

      this.saidaEstoqueService.update(saidaEstoque.id!, operations).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Saída de Estoque editada com sucesso' });
        this.afterSave();
      });
    } else {
      this.saidaEstoqueService.save(removeNullOrUndefinedProperties(saidaEstoque)).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Saída de Estoque salva com sucesso' });
        this.afterSave();
      })
    }
  }

  private afterSave() {
    this.onSave.emit();
    this.internalCloseForm();
  }

  closeForm() {
    if(this.form.dirty){
      this.confirmationService.confirm({
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
          this.internalCloseForm();
        }
      });

      return;
    }

    this.internalCloseForm();
  }

  private internalCloseForm() {
    this.clearReferences();
    this.isVisible = false;
  }

  produtoLabel(produto: Produto) {
    return `${produto.nome} - Estoque Atual: ${produto.estoque}`;
  }

  searchProdutos(event: AutoCompleteCompleteEvent) {
    this.produtoService.findAll(1, 10, `nome=ilike=*${event.query}*`).subscribe(produtos => {
      this.produtosSelect = produtos.content;
    })
  }

}
