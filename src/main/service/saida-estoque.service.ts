import { Injectable } from "../annotation/injectable";
import { ProdutoService } from "./produto.service";
import { Operation } from "fast-json-patch/commonjs/core";
import {SaidaEstoqueRepository} from '../repository/saida-estoque.repository';
import {SaidaEstoque} from '../entity/saida-estoque.entity';
import {NotificationService} from './notification.service';
import {Notification} from '../entity/notification.entity';
import {UsuarioService} from './usuario.service';

@Injectable()
export class SaidaEstoqueService {

    constructor(
        private saidaEstoqueRepository: SaidaEstoqueRepository,
        private produtoService: ProdutoService,
        private notificationService: NotificationService,
        private usuarioService: UsuarioService,
    ) {}

    public async save(saidaEstoque: SaidaEstoque) {
      const quantidadeAnterior = saidaEstoque.produto.estoque;
      const produto = await this.produtoService.attEstoque(saidaEstoque.produto, -saidaEstoque.quantidade);
      const usuario = await this.usuarioService.findUsuarioByContext();

      this.notificationService.add(new Notification(
        'Nova Saída de Estoque',
        `O produto ${produto.nome} teve atualização de estoque de: ${quantidadeAnterior} para: ${produto.estoque} pelo usuário ${usuario.nome}`,
        'pi-arrow-left'
      ));

      return this.saidaEstoqueRepository.save(saidaEstoque);
    }

    public async update(id: number, partials: Operation[]){
        const beforeUpdateSaidaEstoque= await this.saidaEstoqueRepository.findById(id);

        if(!beforeUpdateSaidaEstoque) {
            return
        }

        const updatedSaidaEstoque = await this.saidaEstoqueRepository.update(id, partials);

        if(!updatedSaidaEstoque) {
            return
        }

        await this.produtoService.attEstoque(updatedSaidaEstoque.produto, beforeUpdateSaidaEstoque.quantidade - updatedSaidaEstoque.quantidade);

        return updatedSaidaEstoque;
    }

    public async delete(id: number) {
        const saidaEstoque = await this.saidaEstoqueRepository.findById(id);

        if(!saidaEstoque) {
            return;
        }

        await this.produtoService.attEstoque(saidaEstoque.produto, saidaEstoque.quantidade);

        return this.saidaEstoqueRepository.delete(saidaEstoque.id!);
    }

}
