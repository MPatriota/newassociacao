import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MessageService } from "primeng/api";
import { UsuarioService } from '../../../services/usuario.service';
import { LoginComponent } from '../form/login.component';
import { LoginModule } from '../login.module';
import { Router } from '@angular/router';
import { UsuarioContext } from '../../../context/UsuarioContext';

describe("LoginComponent", () => {

  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;
  let usuarioService: any;
  let router: any;

  beforeEach(async () => {
    usuarioService = {
      findByUsuarioAndSenha: jest.fn(() => of({})),
      login: jest.fn(() => of(undefined)),
    };

    router = {
      navigate: jest.fn(() => Promise.resolve(true)),
    };

    await TestBed.configureTestingModule({
      imports: [LoginModule],
      providers: [
        { provide: UsuarioService, useValue: usuarioService },
        { provide: Router, useValue: router },
        provideAnimations(),
        MessageService,
      ]
    }).compileComponents();
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  })

  it('should login', waitForAsync(() => {
    const usuario = {
      id: 1,
      primeiroAcessoRealizado: true
    }
    usuarioService.findByUsuarioAndSenha = jest.fn(() => of(usuario));

    component.form.patchValue({
      usuario: 'usuario',
      senha: 'senha123'
    })

    expect(UsuarioContext.instance.id).toBeUndefined();

    component.login();

    expect(usuarioService.findByUsuarioAndSenha).toHaveBeenCalledTimes(1);
    expect(usuarioService.findByUsuarioAndSenha).toHaveBeenCalledWith('usuario', 'senha123');
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
    fixture.whenStable().then(() => {
      expect(UsuarioContext.instance.id).toEqual(1);
    })
  }))

  it('should not login', () => {
    usuarioService.findByUsuarioAndSenha = jest.fn(() => of(null));

    component.form.patchValue({
      usuario: 'usuario',
      senha: 'senha123'
    })

    component.login();

    expect(usuarioService.findByUsuarioAndSenha).toHaveBeenCalledTimes(1);
    expect(usuarioService.findByUsuarioAndSenha).toHaveBeenCalledWith('usuario', 'senha123');
    expect(router.navigate).not.toHaveBeenCalled();
    expect(component.credenciaisInvalidas).toBeTruthy();
  })

  it('should set credenciais invalidas to false when usuario changes', () => {
    component.credenciaisInvalidas = true;

    component.form.patchValue({
      usuario: 'usuario',
    })

    expect(component.credenciaisInvalidas).toBeFalsy();
  })

  it('should set credenciais invalidas to false when senha changes', () => {
    component.credenciaisInvalidas = true;

    component.form.patchValue({
      senha: 'senha123',
    })

    expect(component.credenciaisInvalidas).toBeFalsy();
  })

  it('should show form to change password if it is the first access', () => {
    const usuario = {
      id: 1,
      primeiroAcessoRealizado: false,
    }
    usuarioService.findByUsuarioAndSenha = jest.fn(() => of(usuario));

    const senhaFormControl = component.form.get('senha');
    senhaFormControl?.patchValue('senha123');

    component.login();

    expect(component.redefinirSenha).toBeTruthy();
    expect(router.navigate).not.toHaveBeenCalled();
  })

  it('should navigate to home', fakeAsync(() => {
    UsuarioContext.instance.id = 2;

    component.navigateToHome();

    fixture.whenStable().then(() => {
      expect(router.navigate).toHaveBeenCalledTimes(1);
      expect(router.navigate).toHaveBeenCalledWith(['/home']);
      expect(usuarioService.login).toHaveBeenCalledTimes(1);
      expect(usuarioService.login).toHaveBeenCalledWith(2);
      expect(UsuarioContext.instance.isAuthenticated).toBe(true);
    })
  }))
})
