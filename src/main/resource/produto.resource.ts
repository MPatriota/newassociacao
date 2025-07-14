import { IpcClass } from '../annotation/ipc-class';
import { ProdutoService } from '../service/produto.service';
import { Produto } from '../entity/produto.entity';
import { IpcMethod } from '../annotation/ipc-method';
import { Page } from '../dto/page.dto';
import { ProdutoRepository } from '../repository/produto.repository';
import { applyPatch, Operation } from 'fast-json-patch/commonjs/core';
import * as statementSearchModel from '../util/statement/statement-search.model';

@IpcClass("produtos")
export class ProdutoResource {

  constructor(private readonly produtoService: ProdutoService, private readonly produtoRepository: ProdutoRepository) {
  }

  @IpcMethod('save')
  async save(produto: Produto) {
    return this.produtoService.save(produto);
  }


  @IpcMethod('findAll')
  async findAll(page: number,
                limit: number,
                searchStatement?: statementSearchModel.StatementSearchModel | string): Promise<Page<Produto>> {

    return await this.produtoRepository.findAll({
      search: searchStatement,
      limit,
      page
    });

  }

  @IpcMethod('delete')
  async delete(id: number): Promise<void> {
    return this.produtoRepository.delete(id);
  }

  @IpcMethod('findById')
  async findById(id: number): Promise<Produto | null> {
    return this.produtoRepository.findById(id);
  }

  @IpcMethod('update')
  async update(id: number, partials: Operation[]): Promise<Produto | null> {

    const produto = await this.produtoRepository.findById(id);

    const modifiedPartials = partials.map(operation => {
      if (operation.op === 'remove' && operation.path.includes('imagem')) {
        return {
          op: 'replace',
          path: operation.path,
          value: null
        };
      }
      return operation;
    }) as any;

    const editedProduto = applyPatch(produto, modifiedPartials).newDocument;

    if (editedProduto) return this.produtoRepository.save(editedProduto);

    return null;
  }

}
