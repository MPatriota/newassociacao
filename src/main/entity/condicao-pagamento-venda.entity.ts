import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ForceToLoad } from '../annotation/force-to-load';
import { CondicaoPagamento } from './condicao-pagamento.entity';
import { ColumnNumericTransformer } from '../util/typeorm';
import { Venda } from './venda.entity';

@Entity({
  orderBy: {
    id: "DESC"
  }
})
export class CondicaoPagamentoVenda {

  constructor(condicaoPagamentoVenda: CondicaoPagamentoVenda) {
    this.condicaoPagamento = condicaoPagamentoVenda?.condicaoPagamento
    this.valor = condicaoPagamentoVenda?.valor
    this.venda = condicaoPagamentoVenda?.venda
  }

  @PrimaryGeneratedColumn({
    primaryKeyConstraintName: "pk_condicao_pagamento_venda",
  })
  id?: number;

  @ManyToOne(() => CondicaoPagamento, {eager: true})
  @JoinColumn({
    name: "id_condicao_pagamento",
    foreignKeyConstraintName: "fk_condicao_pagamento_venda",
  })
  @ForceToLoad()
  condicaoPagamento: CondicaoPagamento;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumericTransformer()
  })
  valor: number;

  @JoinColumn({
    name: 'id_venda',
    foreignKeyConstraintName: 'fk_venda_condicao_pagamento_venda',
  })
  @ManyToOne(() => Venda, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  venda: Venda;

}
