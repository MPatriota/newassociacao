import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { notBlankValidator } from "../../../util/validator-util";
import { UsuarioService } from '../../../services/usuario.service';
import { UsuarioContext } from '../../../context/UsuarioContext';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'redefinir-senha-form',
  templateUrl: 'redefinir-senha.component.html',
  standalone: false
})
export class RedefinirSenhaComponent implements OnInit {

  @Input() senhaAtual = '';
  @Output() onRedefinirSenha = new EventEmitter<void>();

  form!: FormGroup;

  constructor (
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private messageService: MessageService,
  ) {}

  ngOnInit() {
    this.createForm();
  }

  private createForm() {
    this.form = this.fb.group({
      senha: ['', Validators.compose([notBlankValidator()])],
      confirmacaoSenha: ['', Validators.compose([notBlankValidator()])],
    })

    this.form.get('senha')?.valueChanges.subscribe(() => {
      this.validateSenhaAtual();
      this.validateConfirmacaoSenha();
    })

    this.form.get('confirmacaoSenha')?.valueChanges.subscribe(() => {
      this.validateConfirmacaoSenha();
    })
  }

  private validateConfirmacaoSenha() {
    const senhaControl = this.form.get('senha');
    const confirmacaoSenhaControl = this.form.get('confirmacaoSenha');

    let senha = senhaControl?.value;
    let confirmacaoSenha = confirmacaoSenhaControl?.value;

    if(senha == '' ||  confirmacaoSenha == '') {
      return;
    }

    if(senha != confirmacaoSenha) {
      confirmacaoSenhaControl?.setErrors({genericMessage: 'A confirmação de senha não está igual'})
    }
  }

  private validateSenhaAtual() {
    const senhaControl = this.form.get('senha');

    let senha = senhaControl?.value;

    if(senha == '') {
      return;
    }

    if(senha == this.senhaAtual) {
      senhaControl?.setErrors({genericMessage: 'A nova senha não pode ser igual a senha atual'})
    }

  }

  redefinirSenha() {
    if(UsuarioContext.instance.id) {
      this.usuarioService.redefinirSenha(UsuarioContext.instance.id!, this.form.get('senha')?.value).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Senha alterada com sucesso' });
        this.onRedefinirSenha.emit();
      })
    }
  }

}
