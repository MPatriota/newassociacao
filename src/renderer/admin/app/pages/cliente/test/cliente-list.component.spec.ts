import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClienteModule } from '../cliente.module';
import { ClienteService } from '../../../../../shared/services/cliente.service';
import { of } from 'rxjs';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ClienteListComponent } from "../list/cliente-list.component";
import { Cliente } from "../../../../../shared/model/cliente.model";
import { Confirmation, ConfirmationService, MessageService, ToastMessageOptions } from "primeng/api";
import { PageParameter } from "../../../../../shared/model/page-parameter";
import { Dependente } from "../../../../../shared/model/dependente.model";

describe("ClienteListComponent", () => {

  let fixture: ComponentFixture<ClienteListComponent>;
  let component: ClienteListComponent;
  let clienteService: any;
  let messageService: any;
  let confirmationService: any;
  let cliente: Cliente;

  beforeEach(async () => {
    clienteService = {
      save: jest.fn(() => of({})),
      delete: jest.fn(() => of({})),
      findAll: jest.fn(() => of({})),
    };

    messageService = {
      add: jest.fn()
    }

    confirmationService = new ConfirmationService();
    confirmationService.confirm = jest.fn()

    cliente = {
      id: 1,
      nome: 'Lucas',
      matricula: '123456',
      foto: 'teste',
      limiteCompra: 13.59,
      dependentes: [],
      email: 'cliente@email.com'
    }

    await TestBed.configureTestingModule({
      imports: [ClienteModule],
      providers: [
        { provide: ClienteService, useValue: clienteService },
        { provide: MessageService, useValue: messageService },
        { provide: ConfirmationService, useValue: confirmationService },
        provideAnimations(),
      ]
    }).compileComponents();
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(ClienteListComponent);
    component = fixture.componentInstance;
    jest.spyOn(component.formVisibleChange, 'emit');
    fixture.detectChanges();
  })

  it('should fetch on init', () => {
    expect(clienteService.findAll).toHaveBeenCalledTimes(1);
  })

  it('should search', () => {
    clienteService.findAll.mockClear();

    component.onSearch('teste');

    expect(clienteService.findAll).toHaveBeenCalledTimes(1);
    expect(clienteService.findAll).toHaveBeenCalledWith(1, 10, 'nome=ilike=*teste*;matricula=ilike=*teste*');
  })

  it('should open form when click new', () => {
    component.clickNew();

    expect(component.formVisibleChange.emit).toHaveBeenCalledWith();
  })

  it('should edit', () => {
    component.edit(cliente);

    expect(component.formVisibleChange.emit).toHaveBeenCalledWith(cliente.id);
  })

  it('should fetch when close form', () => {
    clienteService.findAll.mockClear();

    component.onSave();

    expect(clienteService.findAll).toHaveBeenCalledWith(1, 10, '');
  })

  it('loadData', () => {
    let pageParameter = new PageParameter(2, 15);
    component.loadData(pageParameter);

    expect(component.pageParameters.page).toEqual(2);
    expect(component.pageParameters.limit).toEqual(15);
  })

  it('should delete cliente', () => {
    component.delete(cliente);

    expect(confirmationService.confirm).toHaveBeenCalledTimes(1);
    expect(confirmationService.confirm).toHaveBeenCalledWith(expect.objectContaining({
      header: 'Confirmação',
      message: `Você tem certeza que deseja excluir o cliente <b>${cliente.nome}</b>?`,
      icon: 'pi pi-info-circle',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Deletar',
        severity: 'danger',
      }
    }))

    let [confirmationCallArgument]: Confirmation[] = confirmationService.confirm.mock.calls[0];

    confirmationCallArgument.accept!();

    expect(clienteService.delete).toHaveBeenCalledTimes(1);
    expect(clienteService.delete).toHaveBeenCalledWith(cliente.id);
    expect(messageService.add).toHaveBeenCalledTimes(1);
    expect(messageService.add).toHaveBeenCalledWith({ severity: 'success', summary: 'Sucesso', detail: 'Cliente excluído com sucesso.' });
  })

  it('should show dependentes', () => {
    jest.spyOn(component.dependentesPopover, 'toggle');

    let dependente: Dependente = {
      id: 1,
      nome: 'Lucas'
    }

    cliente.dependentes.push(dependente);

    const mouseEvent = new MouseEvent("");

    component.showDependentes(cliente, mouseEvent);

    expect(component.dependentesToShow).toEqual(cliente.dependentes);
    expect(component.dependentesPopover.toggle).toHaveBeenCalledTimes(1);
    expect(component.dependentesPopover.toggle).toHaveBeenCalledWith(mouseEvent);
  })

  it('should not show dependentes if dependentes is empty', () => {
    jest.spyOn(component.dependentesPopover, 'toggle');

    cliente.dependentes = [];

    component.showDependentes(cliente, new MouseEvent(""));

    expect(component.dependentesToShow).toEqual([]);
    expect(component.dependentesPopover.toggle).not.toHaveBeenCalled();
  })
})
