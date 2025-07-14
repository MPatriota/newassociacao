import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { VendaService } from '../../../shared/services/venda.service';
import { CaixaStatus } from '../../../shared/enum/caixa-status.enum';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AberturaCaixaService } from '../../../shared/services/abertura-caixa.service';
import { RazaoFechamentoCaixa } from '../../../shared/model/razao-fechamento-caixa.model';
import { AberturaCaixa } from '../../../shared/model/abertura-caixa.model';
import { FechamentoCaixaService } from '../../../shared/services/fechamento-caixa.service';

@Component({
  selector: 'abertura-fechamento-caixa',
  templateUrl: './abertura-fechamento-caixa.component.html',
  styleUrl: 'abertura-fechamento-caixa.component.scss',
  standalone: false,
})
export class AberturaFechamentoCaixaComponent implements OnInit {
  @Input({required: true}) status!: CaixaStatus;
  @Output() statusChange = new EventEmitter<CaixaStatus>();

  form!: FormGroup;
  isModalOpened = false;
  aberturaCaixa?: AberturaCaixa;
  razoesFechamentoCaixa: RazaoFechamentoCaixa[] = [];

  constructor (
    private fb: FormBuilder,
    private aberturaCaixaService: AberturaCaixaService,
    private vendaService: VendaService,
    private fechamentoCaixaService: FechamentoCaixaService
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.findLastOpenedAberturaCaixa();
  }

  private createForm() {
    this.form = this.fb.group({
      saldoCaixa: [0, Validators.min(0)]
    })
  }

  private findLastOpenedAberturaCaixa() {
    this.aberturaCaixaService.findLastOpened().subscribe(aberturaCaixa => {
      this.setAberturaCaixa(aberturaCaixa);
    })
  }

  public openModal() {
    if(this.status.isAberto) {
      this.vendaService.findRazoesFechamentoCaixa(this.aberturaCaixa?.id!).subscribe(razoes => {
        this.razoesFechamentoCaixa = razoes;
      })
    }

    this.isModalOpened = true;
  }

  public closeModal() {
    this.isModalOpened = false;
  }

  public changeStatus(): void {
    if(this.status.isFechado) {
      this.abrirCaixa();
    } else {
      this.fecharCaixa();
    }
  }

  private abrirCaixa() {
    this.aberturaCaixaService.save(this.form.value).subscribe(aberturaCaixa => {
      this.setAberturaCaixa(aberturaCaixa);
      this.closeModal();
    })
  }

  private setAberturaCaixa(aberturaCaixa?: AberturaCaixa) {
    this.aberturaCaixa = aberturaCaixa;

    this.status = this.aberturaCaixa ? CaixaStatus.ABERTO : CaixaStatus.FECHADO;

    this.statusChange.emit(this.status);
  }

  private fecharCaixa() {
    this.fechamentoCaixaService.save({
      razoes: this.razoesFechamentoCaixa,
      aberturaCaixa: this.aberturaCaixa!
    }).subscribe(() => {
      this.setAberturaCaixa();
      this.closeModal();
    })
  }

  protected readonly parseInt = parseInt;
  protected readonly Number = Number;
}
