import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {  FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from "primeng/api";
import { notBlankValidator } from "../../../util/validator-util";
import { getOperations, removeNullOrUndefinedProperties } from "../../../util/json.util";
import { Usuario } from '../../../model/usuario.model';
import { UsuarioService } from '../../../services/usuario.service';
import { UsuarioContext } from "../../../context/UsuarioContext";

@Component({
  selector: 'perfil',
  templateUrl: 'perfil.component.html',
  standalone: false
})
export class PerfilComponent implements OnInit {

  @Input() isVisibleChange!: EventEmitter<number | undefined>;
  @Output() onSave = new EventEmitter<void>;

  form!: FormGroup;
  isVisible = false;
  originalValue?: Usuario;
  redefinirSenha = false;

  constructor (
    private usuarioService: UsuarioService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
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
      nome: ['', Validators.compose([notBlankValidator(), Validators.minLength(2), Validators.maxLength(100)])],
      senha: ['', Validators.compose([notBlankValidator()])],
      usuario: ['', Validators.compose([notBlankValidator()])],
      primeiroAcessoRealizado: [false],
    })
  }

  private configureForm(id?: number) {
    if(id){
      this.usuarioService.findById(id).subscribe(foundUser => {
        this.setFoundUsuarioFormValue(foundUser)
      })
    }
  }

  private setFoundUsuarioFormValue(usuario: Usuario) {
    this.form.patchValue(usuario);
    this.originalValue = usuario;
  }

  save() {
    if(this.form.invalid){
      return;
    }

    const usuario: Usuario = this.form.getRawValue();

    const operations = getOperations(this.originalValue, usuario);

    this.usuarioService.update(usuario.id!, operations).subscribe(() => {
      this.afterSave();
    });
  }

  private afterSave() {
    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Informações do perfil salvas com sucesso' });
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

  private clearReferences() {
    this.originalValue = undefined;
  }

  changeRedefinirSenha() {
    this.redefinirSenha = !this.redefinirSenha;
  }

  onRedefinirSenha() {
    this.changeRedefinirSenha();

    const usuarioId = UsuarioContext.instance.id;

    if(usuarioId) {
      this.configureForm(usuarioId);
    }
  }

}
