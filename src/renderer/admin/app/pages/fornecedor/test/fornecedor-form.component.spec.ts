import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FornecedorFormComponent } from '../form/fornecedor-form.component';
import { Endereco } from '../../../../../shared/model/endereco.model';
import { of } from 'rxjs';
import { provideAnimations } from '@angular/platform-browser/animations';
import { EventEmitter } from "@angular/core";
import { CepService } from "../../../../../shared/services/cep.service";
import { CepApiInformation } from "../../../../../shared/model/cep.model";
import { Confirmation, ConfirmationService, MessageService } from "primeng/api";
import { FornecedorModule } from "../fornecedor.module";
import { FornecedorService } from "../../../../../shared/services/fornecedor.service";
import { Fornecedor } from "../../../../../shared/model/fornecedor.model";
import { DocumentoTipo } from "../../../../../shared/enum/documento-tipo.enum";
import { CondicaoPagamentoService } from "../../../../../shared/services/condicao-pagamento.service";
import { CondicaoPagamento } from "../../../../../shared/model/condicao-pagamento.model";

describe("FornecedorFormComponent", () => {

  let fixture: ComponentFixture<FornecedorFormComponent>;
  let component: FornecedorFormComponent;
  let fornecedorService: any;
  let isVisibleChange = new EventEmitter<number | undefined>;
  let cepService: any;
  let confirmationService: any;
  let cepAPIInformation: CepApiInformation = {
    logradouro: "rua",
    bairro: "bairro",
    estado: "Paraná",
    localidade: "Maringá",
    uf: "PR"
  }
  let fornecedor: Fornecedor;
  let endereco: Endereco;
  let condicaoPagamentoService: any;
  let condicaoPagamento: CondicaoPagamento;

  beforeEach(async () => {
    fornecedorService = {
      save: jest.fn(() => of({})),
      findById: jest.fn(() => of({})),
      update: jest.fn(() => of({}))
    };

    cepService = {
      findByCep: jest.fn(() => of(cepAPIInformation))
    }

    confirmationService = {
      confirm: jest.fn()
    }

    endereco = {
      id: undefined,
      cep: '12345678',
      logradouro: 'rua teste',
      numero: '69',
      bairro: 'bairro teste',
      cidade: 'Maringá',
      estado: 'PR'
    }

    condicaoPagamento = {
      id: 1,
      nome: 'Lucas',
      parcelas: 1,
      intervalo: 2,
      vencimento: 3,
      descricao: 'descricao',
      ativa: true
    }

    fornecedor = {
      id: undefined,
      nome: 'Lucas',
      documento: '12345678901',
      responsavel: 'Responsável',
      email: 'empresa@email.com',
      telefone: '44999999999',
      endereco,
      documentoTipo: DocumentoTipo.CPF.value,
      condicaoPagamento
    }

    condicaoPagamentoService = {
      findAll: jest.fn(() => of({content: []}))
    };

    await TestBed.configureTestingModule({
      imports: [FornecedorModule],
      providers: [
        { provide: FornecedorService, useValue: fornecedorService },
        { provide: CepService, useValue: cepService },
        { provide: ConfirmationService, useValue: confirmationService },
        { provide: CondicaoPagamentoService, useValue: condicaoPagamentoService },
        provideAnimations(),
        MessageService
      ]
    }).compileComponents();
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(FornecedorFormComponent);
    component = fixture.componentInstance;
    jest.spyOn(component.onSave, 'emit');
    component.isVisibleChange = isVisibleChange;
    fixture.detectChanges();
  })

  it('should not save if form is invalid', () => {
    component.form.setErrors({someError: true});

    component.save();

    expect(fornecedorService.save).not.toHaveBeenCalled();
  })

  it('should update', () => {
    const enderecoUpdate = {
      id: 1,
      cep: '12345679',
      logradouro: 'rua teste 2',
      numero: '699',
      bairro: 'bairro teste 2',
      cidade: 'Sarandi',
      estado: 'MT'
    }

    const condicaoPagamentoUpdate = {
      id: 2,
      nome: 'Lucas',
      parcelas: 1,
      intervalo: 2,
      vencimento: 3,
      descricao: 'descricao',
      ativa: true
    }

    const fornecedorUpdate: Fornecedor = {
      id: 1,
      nome: 'Lucas 2',
      documento: '12345678902',
      responsavel: 'Responsável 2',
      email: 'empresa2@email.com',
      telefone: '44999999998',
      endereco: enderecoUpdate,
      documentoTipo: DocumentoTipo.CNPJ.value,
      condicaoPagamento: condicaoPagamentoUpdate
    }

    component.form.patchValue(fornecedorUpdate);

    component.originalValue = {...fornecedor, id: 1, endereco: {...endereco, id: 1}};

    component.isVisible = true;

    component.save();

    expect(fornecedorService.update).toHaveBeenCalledTimes(1);
    expect(fornecedorService.update).toHaveBeenCalledWith(1, [
      {op: 'replace', path: '/condicaoPagamento/id', value: 2},
      { op: 'replace', path: '/documentoTipo', value: 'cnpj' },
      { op: 'replace', path: '/endereco/estado', value: 'MT' },
      { op: 'replace', path: '/endereco/cidade', value: 'Sarandi' },
      { op: 'replace', path: '/endereco/bairro', value: 'bairro teste 2' },
      { op: 'replace', path: '/endereco/numero', value: '699' },
      { op: 'replace', path: '/endereco/logradouro', value: 'rua teste 2' },
      { op: 'replace', path: '/endereco/cep', value: '12345679' },
      { op: 'replace', path: '/telefone', value: '44999999998' },
      { op: 'replace', path: '/email', value: 'empresa2@email.com' },
      { op: 'replace', path: '/responsavel', value: 'Responsável 2' },
      { op: 'replace', path: '/documento', value: '12345678902' },
      { op: 'replace', path: '/nome', value: 'Lucas 2' }
    ]);
    expect(component.onSave.emit).toHaveBeenCalledTimes(1);
    expect(component.isVisible).toBeFalsy();
    expect(component.originalValue).toBeUndefined();
  })

  it('should save', () => {
    component.form.patchValue(fornecedor);

    component.isVisible = true;

    component.save();

    expect(fornecedorService.save).toHaveBeenCalledTimes(1);
    expect(fornecedorService.save).toHaveBeenCalledWith(fornecedor);
    expect(component.onSave.emit).toHaveBeenCalledTimes(1);
    expect(component.isVisible).toBeFalsy();
    expect(component.originalValue).toBeUndefined();
  })

  it('should close dirty form', () => {
    component.isVisible = true;
    component.form.markAsDirty();

    component.closeForm();

    let [callArgument]: Confirmation[] = confirmationService.confirm.mock.calls[0];

    expect(callArgument).toEqual(expect.objectContaining(
      {
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
        }
      }
    ))
    expect(component.isVisible).toBeTruthy();

    callArgument.accept!();

    expect(component.isVisible).toBeFalsy();
  })

  it('should close not dirty form', () => {
    component.isVisible = true;

    component.closeForm();

    expect(confirmationService.confirm).not.toHaveBeenCalled();
    expect(component.isVisible).toBeFalsy();
  })

  it('visible change without id', () => {
    component.isVisible = false;
    component.stepperActiveIndex = 2;

    isVisibleChange.emit();

    expect(component.isVisible).toBeTruthy();
    expect(fornecedorService.findById).not.toHaveBeenCalled();
    expect(component.stepperActiveIndex).toEqual(1);
  })

  it('visible change with id', () => {
    fornecedorService.findById.mockReturnValue(of(fornecedor));

    component.isVisible = false;
    component.stepperActiveIndex = 2;

    isVisibleChange.emit(1);

    expect(component.isVisible).toBeTruthy();
    expect(fornecedorService.findById).toHaveBeenCalledWith(1);
    expect(component.form.getRawValue()).toEqual({...fornecedor});
    expect(component.stepperActiveIndex).toEqual(1);
  })

  it('should search for CEP informations when CEP changes', () => {
    const enderecoForm = component.form.get('endereco')!
    let cepFormControl = enderecoForm.get('cep')!;

    cepFormControl.patchValue("87047415");

    expect(cepService.findByCep).toHaveBeenCalledTimes(1);
    expect(cepService.findByCep).toHaveBeenCalledWith("87047415");

    expect(enderecoForm.value).toEqual(expect.objectContaining({
      logradouro: cepAPIInformation.logradouro,
      bairro: cepAPIInformation.bairro,
      cidade: cepAPIInformation.localidade,
      estado: cepAPIInformation.uf,
    }))
  })

  it('should search for condicoes pagamento', () => {
    condicaoPagamentoService.findAll = jest.fn(() => of({content: [condicaoPagamento]}));

    component.searchCondicoesPagamento({query: 'teste'} as any);

    expect(condicaoPagamentoService.findAll).toHaveBeenCalledWith(1, 10, "nome=ilike=*teste*");
    expect(component.condicoesPagamentoSelect).toEqual([condicaoPagamento]);
  })

})
