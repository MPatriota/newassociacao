import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {  FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from "primeng/api";
import { notBlankValidator } from "../../../../../shared/util/validator-util";
import { getOperations, removeNullOrUndefinedProperties } from "../../../../../shared/util/json.util";
import { Usuario } from '../../../../../shared/model/usuario.model';
import { UsuarioService } from '../../../../../shared/services/usuario.service';

@Component({
  selector: 'usuario-form',
  templateUrl: 'usuario-form.component.html',
  standalone: false
})
export class UsuarioFormComponent implements OnInit {

  @Input() isVisibleChange!: EventEmitter<number | undefined>;
  @Output() onSave = new EventEmitter<void>;

  form!: FormGroup;
  isVisible = false;
  originalValue?: Usuario;

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
      primeiroAcessoRealizado: [{value: false, disabled: true}],
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

    if(this.originalValue) {
      const operations = getOperations(this.originalValue, usuario);

      this.usuarioService.update(usuario.id!, operations).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Usuário editado com sucesso' });
        this.afterSave();
      });
    } else {
      this.usuarioService.save(removeNullOrUndefinedProperties(usuario)).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Usuário salvo com sucesso' });
        this.afterSave();
      })
    }
  }

  private afterSave() {
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

}
