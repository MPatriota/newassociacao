import { CondicaoPagamentoService } from '../condicao-pagamento.service';
import { ElectronService } from 'ngx-electron';
import { TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import { DateService } from '../date.service';

describe("CondicaoPagamentoService", () => {

  let condicaoPagamentoService: CondicaoPagamentoService;
  let dateService: any;

  beforeEach(async () => {
    dateService = {
      getCurrentDate: jest.fn(() => new Date(2025, 2, 21))
    }

    await TestBed.configureTestingModule({
      providers: [
        { provide: DateService, useValue: dateService },
        MessageService,
        CondicaoPagamentoService,
        ElectronService
      ]
    }).compileComponents();

    condicaoPagamentoService = TestBed.inject(CondicaoPagamentoService);
  })

  it('should generate dates', () => {
    const condicaoPagamento = {
      id: 1,
      nome: 'Lucas',
      parcelas: 3,
      intervalo: 4,
      vencimento: 5,
      descricao: 'descricao',
      ativa: true
    };

    let dates = condicaoPagamentoService.generateDates(condicaoPagamento);

    expect(dates).toEqual([
      new Date(2025, 2, 26),
      new Date(2025, 2, 30),
      new Date(2025, 3, 3)
    ])
  })
})
