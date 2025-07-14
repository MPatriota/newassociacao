import { Injectable } from '../annotation/injectable';
import { Produto } from '../entity/produto.entity';
import { ProdutoRepository } from '../repository/produto.repository';
import Decimal from 'decimal.js';

@Injectable()
export class ProdutoService {

  constructor(private readonly produtoRepository: ProdutoRepository) {
  }

  public async save(produto: Produto): Promise<Produto> {

    if (produto.imagem && produto.imagem.length > 1024 * 1024 * 2) {
        return Promise.reject(new Error('Tamanho da imagem excedido. Máximo 2 MB'));
    }

    return this.produtoRepository.save(produto);
  }

  public async attEstoque(produto: Produto, quantidade: number) {
    produto.estoque += quantidade;

    if(produto.estoque < 0) {
      throw new Error("Estoque Insuficiente.")
    }

    return await this.produtoRepository.save(produto);
  }

}
