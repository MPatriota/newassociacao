import { Injectable } from "../annotation/injectable";
import { EntradaEstoqueRepository } from "../repository/entrada-estoque.repository";
import { EntradaEstoque } from "../entity/entrada-estoque.entity";
import { ProdutoService } from "./produto.service";
import { Operation } from "fast-json-patch/commonjs/core";
import {NotificationService} from './notification.service';
import {UsuarioContext} from '../context/UsuarioContext';
import {Notification} from '../entity/notification.entity';
import {UsuarioService} from './usuario.service';

@Injectable()
export class EntradaEstoqueService {

    constructor(
        private entradaEstoqueRepository: EntradaEstoqueRepository,
        private produtoService: ProdutoService,
        private notificationService: NotificationService,
        private usuarioService: UsuarioService,
    ) {}

    public async save(entradaEstoque: EntradaEstoque) {
      const quantidadeAnterior = entradaEstoque.produto.estoque;
      const produto = await this.produtoService.attEstoque(entradaEstoque.produto, entradaEstoque.quantidade);
      const usuario = await this.usuarioService.findUsuarioByContext();

      this.notificationService.add(new Notification(
        'Nova Entrada de Estoque',
        `O produto ${produto.nome} teve atualização de estoque de: ${quantidadeAnterior} para: ${produto.estoque} pelo usuário ${usuario.nome}`,
        'pi-arrow-right'
      ));

      return this.entradaEstoqueRepository.save(entradaEstoque);
    }

    public async update(id: number, partials: Operation[]){
        const beforeUpdateEntradaEstoque= await this.entradaEstoqueRepository.findById(id);

        if(!beforeUpdateEntradaEstoque) {
            return
        }

        const updatedEntradaEstoque = await this.entradaEstoqueRepository.update(id, partials);

        if(!updatedEntradaEstoque) {
            return
        }

        await this.produtoService.attEstoque(updatedEntradaEstoque.produto, updatedEntradaEstoque.quantidade - beforeUpdateEntradaEstoque.quantidade);

        return updatedEntradaEstoque;
    }

    public async delete(id: number) {
        const entradaEstoque = await this.entradaEstoqueRepository.findById(id);

        if(!entradaEstoque) {
            return;
        }

        await this.produtoService.attEstoque(entradaEstoque.produto, -entradaEstoque.quantidade);

        return this.entradaEstoqueRepository.delete(entradaEstoque.id!);
    }

}
