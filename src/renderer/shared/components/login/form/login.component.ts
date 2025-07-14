import { Component, OnInit } from '@angular/core';
import {  FormBuilder, FormGroup, Validators } from '@angular/forms';
import { notBlankValidator } from "../../../util/validator-util";
import { UsuarioService } from '../../../services/usuario.service';
import { Router } from '@angular/router';
import { UsuarioContext } from '../../../context/UsuarioContext';

@Component({
  selector: 'login-form',
  templateUrl: 'login.component.html',
  standalone: false
})
export class LoginComponent implements OnInit {

  form!: FormGroup;
  credenciaisInvalidas = false;
  redefinirSenha = false;

  constructor (
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.createForm();

    if (process.env['NODE_ENV'] == 'development') {
      UsuarioContext.instance.id = 1;
      this.navigateToHome();
    }
  }

  private createForm() {
    const form = this.fb.group({
      usuario: ['', Validators.compose([notBlankValidator()])],
      senha: ['', Validators.compose([notBlankValidator()])],
    })

    form.get('usuario')?.valueChanges.subscribe(value => {
      this.credenciaisInvalidas = false;
    })

    form.get('senha')?.valueChanges.subscribe(value => {
      this.credenciaisInvalidas = false;
    })

    this.form = form;
  }

  login() {
    const usuario = this.form.get('usuario')?.value;
    const senhaFormControl = this.form.get('senha');

    this.usuarioService.findByUsuarioAndSenha(usuario, senhaFormControl?.value).subscribe(usuario => {
      if (usuario) {
        if(usuario.id) {
          UsuarioContext.instance.id = usuario.id;
        }

        if(usuario.primeiroAcessoRealizado) {
          this.navigateToHome();
        } else {
          this.redefinirSenha = true;
        }

      } else {
        this.credenciaisInvalidas = true;
      }
    })
  }

  navigateToHome() {
    this.router.navigate(['/home']).then(() => {
      if(UsuarioContext.instance.id) {
        this.usuarioService.login(UsuarioContext.instance.id).subscribe(() => {
          UsuarioContext.instance.authenticate();
        });
      }

    })
  }

}
