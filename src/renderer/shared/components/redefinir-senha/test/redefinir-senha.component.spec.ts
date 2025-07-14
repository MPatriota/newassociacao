import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MessageService } from "primeng/api";
import { UsuarioService } from '../../../services/usuario.service';
import { Router } from '@angular/router';
import { UsuarioContext } from '../../../context/UsuarioContext';
import { RedefinirSenhaComponent } from '../form/redefinir-senha.component';
import { RedefinirSenhaModule } from '../redefinir-senha.module';
import { compileOpaqueAsyncClassMetadata } from '@angular/compiler';

describe("RedefinirSenhaComponent", () => {

  let fixture: ComponentFixture<RedefinirSenhaComponent>;
  let component: RedefinirSenhaComponent;
  let usuarioService: any;

  beforeEach(async () => {
    usuarioService = {
      findByEmailAndSenha: jest.fn(() => of({})),
      redefinirSenha: jest.fn(() => of(null)),
    };

    await TestBed.configureTestingModule({
      imports: [RedefinirSenhaModule],
      providers: [
        { provide: UsuarioService, useValue: usuarioService },
        provideAnimations(),
        MessageService,
      ]
    }).compileComponents();
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(RedefinirSenhaComponent);
    component = fixture.componentInstance;
    jest.spyOn(component.onRedefinirSenha, 'emit');
    fixture.detectChanges();
  })

  it('should validate confirmacao senha when confirmacaoSenha changes', () => {
    component.form.patchValue({
      senha: 'teste123',
      confirmacaoSenha: 'teste123',
    })

    const confirmacaoSenhaFormControl = component.form.get('confirmacaoSenha');

    expect(confirmacaoSenhaFormControl?.errors).toBeNull();

    confirmacaoSenhaFormControl?.patchValue('teste');

    expect(confirmacaoSenhaFormControl?.errors).toEqual({genericMessage: 'A confirmação de senha não está igual'})
  })

  it('should validate confirmacao senha when senha changes', () => {
    component.form.patchValue({
      senha: 'teste123',
      confirmacaoSenha: 'teste123',
    })

    const senhaFormControl = component.form.get('senha');

    expect(senhaFormControl?.errors).toBeNull();

    senhaFormControl?.patchValue('teste');

    let confirmacaoSenhaFormControl = component.form.get('confirmacaoSenha');

    expect(confirmacaoSenhaFormControl?.errors).toEqual({genericMessage: 'A confirmação de senha não está igual'})
  })

  it('should validate senha atual', () => {
    component.senhaAtual = 'teste123';

    component.form.patchValue({
      senha: 'teste'
    })

    const senhaFormControl = component.form.get('senha');

    expect(senhaFormControl?.errors).toBeNull();

    senhaFormControl?.patchValue('teste123');

    expect(senhaFormControl?.errors).toEqual({genericMessage: 'A nova senha não pode ser igual a senha atual'});
  })

  it('should redefine senha', waitForAsync(() => {
    component.form.patchValue({
      senha: 'teste123',
      confirmacaoSenha: 'teste123'
    })

    UsuarioContext.instance.id = 1;

    component.redefinirSenha();

    expect(usuarioService.redefinirSenha).toHaveBeenCalledTimes(1);
    expect(usuarioService.redefinirSenha).toHaveBeenCalledWith(1, 'teste123');
    expect(component.onRedefinirSenha.emit).toHaveBeenCalledTimes(1);
  }))
})
