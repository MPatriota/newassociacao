import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { InputSwitchChangeEvent } from 'primeng/inputswitch';
import { UtensilioService } from '../../../../../shared/services/utensilio.service';
import { Utensilio } from '../../../../../shared/model/utensilio.model';
import { QuiosqueForm } from '../form/quiosque-form';
import { QuiosqueService } from '../../../../../shared/services/quiosque.service';
import { finalize } from 'rxjs';
import {
  ImageUploadMultipleComponent
} from '../../../../../shared/components/image-upload-multiple/image-upload-multiple.component';

@Component({
  selector: 'quiosque-quiosque-creator',
  standalone: false,
  templateUrl: 'quiosque-form.component.html',
  styleUrl: `quiosque-form.component.scss`
})
export class QuiosqueFormComponent implements OnInit {

  @Input() id?: string;

  quiosqueForm!: QuiosqueForm;

  utensilios: Utensilio[] = [];

  newUtensilioName: string = '';

  submitted: boolean = false;

  @ViewChild('imageUploadMultipleComponent') imageUploadMultipleComponent!: ImageUploadMultipleComponent;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private quiosqueService: QuiosqueService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private utensilioService: UtensilioService
  ) {
    this.quiosqueForm = new QuiosqueForm(fb);
  }

  get formControls() {
    return this.quiosqueForm.form.controls;
  }

  ngOnInit(): void {
    this.utensilioService.findAll().subscribe(utensilios => {
      this.utensilios = utensilios.map(u => {
        u['quantidade'] = 0
        return u;
      });

      if(this.id != 'novo') {
        this.quiosqueService.findById(Number(this.id)).subscribe(quiosque => {
          this.quiosqueForm.form.patchValue(quiosque);

          quiosque.utensilios.forEach((quiosqueUtensilio: any) => {
            let foundUtensilio = this.utensilios.find(existingUtensilio => existingUtensilio.id == quiosqueUtensilio.utensilio.id);

            if(foundUtensilio){
              foundUtensilio['selecionado'] = true;
              foundUtensilio['quantidade'] = quiosqueUtensilio.quantidade;
              foundUtensilio['existingId'] = quiosqueUtensilio.id;
            }
          })

          this.imageUploadMultipleComponent.imagesBase64 = quiosque.imagens.map(imagem => imagem.imagem);
        })
      }

    });
  }

  toggleUtensilio(utensilio: any) {
    utensilio.selecionado = !utensilio.selecionado;

    if(utensilio.selecionado) {
      utensilio.quantidade = 1;
    } else {
      utensilio.quantidade = 0;
    }
  }

  createUtensilio() {

    if (this.newUtensilioName.trim()) {

      const existent = this.utensilios.find(u => u.nome.toLowerCase() === this.newUtensilioName.toLowerCase());

      if (!existent) {

        this.utensilioService.save({ nome: this.newUtensilioName }).subscribe((savedUtensilio) => {

          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: `Utensílio "${this.newUtensilioName}" adicionado com sucesso`
          });

          this.utensilios.push({
            id: savedUtensilio.id,
            nome: this.newUtensilioName,
            selecionado: true,
            quantidade: 1
          });

          this.newUtensilioName = '';

        });

      } else {

        this.messageService.add({
          severity: 'warn',
          summary: 'Atenção',
          detail: 'Este utensílio já existe na lista'
        });

      }

    }

  }

  save() {

    this.submitted = true;

    const quiosqueData = {
      ...this.quiosqueForm.form.value,
      utensilios: this.utensilios.filter(u => u['selecionado']).map(u => ({ id: u['existingId'], utensilio: u, quantidade: u['quantidade'] })),
      imagens: this.imageUploadMultipleComponent.imagesBase64.map(image => ({ imagem: image }))
    };

    this.quiosqueService.save(quiosqueData)
      .pipe(finalize(() => this.submitted = false))
      .subscribe(() => {

        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Quiosque cadastrado com sucesso!'
        });

        this.goBack();

      });

  }

  cancel() {

    if (this.quiosqueForm.isDirty) {

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
          this.goBack();
        }
      });

    } else {
      this.goBack();
    }
  }

  onStatusChange(event: InputSwitchChangeEvent) {
    this.quiosqueForm.status = event.checked;
  }

  private goBack() {
    this.router.navigate(['/quiosques']);
  }

}
