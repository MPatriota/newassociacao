import {ComponentFixture, TestBed} from '@angular/core/testing';
import { AberturaFechamentoCaixaComponent} from '../abertura-fechamento-caixa.component';
import { AberturaFechamentoCaixaModule} from '../abertura-fechamento-caixa.module';
import { CaixaStatus } from '../../../../shared/enum/caixa-status.enum';
import { AberturaCaixaService } from '../../../../shared/services/abertura-caixa.service';
import { of } from 'rxjs';
import { VendaService } from '../../../../shared/services/venda.service';
import { FechamentoCaixaService } from '../../../../shared/services/fechamento-caixa.service';

fdescribe("AberturaFechamentoCaixaComponent", () => {

  let fixture: ComponentFixture<AberturaFechamentoCaixaComponent>;
  let component: AberturaFechamentoCaixaComponent;
  let aberturaCaixaService: any;
  let vendaService: any;
  let fechamentoCaixaService: any;

  beforeEach(async () => {
    aberturaCaixaService = {
      save: jest.fn(() => of({})),
      findLastOpened: jest.fn(() => of())
    }

    vendaService = {
      findRazoesFechamentoCaixa: jest.fn(() => of([]))
    }

    fechamentoCaixaService = {
      save: jest.fn(() => of({}))
    }

    await TestBed.configureTestingModule({
      imports: [AberturaFechamentoCaixaModule],
      providers: [
        { provide: AberturaCaixaService, useValue:  aberturaCaixaService },
        { provide: VendaService, useValue:  vendaService },
        { provide: FechamentoCaixaService, useValue:  fechamentoCaixaService },
      ]
    }).compileComponents();
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(AberturaFechamentoCaixaComponent);
    component = fixture.componentInstance;
    jest.spyOn(component.statusChange, 'emit');
    component.status = CaixaStatus.FECHADO;
    fixture.detectChanges();
  })

  it('should open modal', () => {
    component.isModalOpened = false;

    component.openModal();

    expect(component.isModalOpened).toBeTruthy();
    expect(vendaService.findRazoesFechamentoCaixa).not.toHaveBeenCalled();
  })

  it('should close modal', () => {
    component.isModalOpened = true;

    component.closeModal();

    expect(component.isModalOpened).toBeFalsy();
  })

  it('should abrir caixa', () => {
    const savedAberturaCaixa = {
      id: 1
    }

    aberturaCaixaService.save = jest.fn(() => of(savedAberturaCaixa));

    component.status = CaixaStatus.FECHADO;
    component.form.patchValue({
      saldoCaixa: 10
    })
    component.isModalOpened = true;

    component.changeStatus();

    expect(aberturaCaixaService.save).toHaveBeenCalledTimes(1);
    expect(aberturaCaixaService.save).toHaveBeenCalledWith({
      saldoCaixa: 10
    });

    expect(component.aberturaCaixa).toEqual(savedAberturaCaixa);
    expect(component.status).toEqual(CaixaStatus.ABERTO);
    expect(component.isModalOpened).toBeFalsy();
    expect(component.statusChange.emit).toHaveBeenCalledWith(CaixaStatus.ABERTO);
  })

  it('should find razoes fechamento caixa when open modal and status is ABERTO', () => {
    const razoesToReturn = [
      {
        condicaoPagamento: {
          id: 1
        },
        valorRegistrado: 1
      }
    ]

    vendaService.findRazoesFechamentoCaixa = jest.fn(() => of(razoesToReturn));

    component.status = CaixaStatus.ABERTO;
    component.aberturaCaixa = {id: 1} as any;

    component.openModal();

    expect(vendaService.findRazoesFechamentoCaixa).toHaveBeenCalledTimes(1);
    expect(vendaService.findRazoesFechamentoCaixa).toHaveBeenCalledWith(1);
    expect(component.razoesFechamentoCaixa).toEqual(razoesToReturn);
  })

  it('should fechar caixa', () => {
    component.status = CaixaStatus.ABERTO;
    component.isModalOpened = true;
    component.razoesFechamentoCaixa = [
      {
        condicaoPagamento: {
          id: 1
        } as any,
        valorRegistrado: 1,
        valorContado: 1
      }
    ]
    component.aberturaCaixa = {
      id: 1
    } as any

    component.changeStatus();

    expect(fechamentoCaixaService.save).toHaveBeenCalledTimes(1);
    expect(fechamentoCaixaService.save).toHaveBeenCalledWith({
      razoes: [
        {
          condicaoPagamento: {
            id: 1
          } as any,
          valorRegistrado: 1,
          valorContado: 1
        }
      ],
      aberturaCaixa: {
        id: 1
      }
    });

    expect(component.aberturaCaixa).toBeUndefined();
    expect(component.status).toEqual(CaixaStatus.FECHADO);
    expect(component.isModalOpened).toBeFalsy();
    expect(component.statusChange.emit).toHaveBeenCalledWith(CaixaStatus.FECHADO);
  })

  it('should find current abertura caixa on init', () => {
    aberturaCaixaService.findLastOpened.mockReset();
    aberturaCaixaService.findLastOpened = jest.fn(() => of({
      id: 1
    }));

    component.ngOnInit();

    expect(aberturaCaixaService.findLastOpened).toHaveBeenCalledTimes(1);
    expect(component.aberturaCaixa).toEqual({id: 1});
    expect(component.status).toEqual(CaixaStatus.ABERTO);
    expect(component.statusChange.emit).toHaveBeenCalledWith(CaixaStatus.ABERTO);
  })

})
