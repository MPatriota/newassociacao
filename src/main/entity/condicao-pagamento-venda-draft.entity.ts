import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ForceToLoad } from '../annotation/force-to-load';
import { CondicaoPagamento } from './condicao-pagamento.entity';
import { ColumnNumericTransformer } from '../util/typeorm';
import { VendaDraft } from './venda-draft.entity';

@Entity({
  orderBy: {
    id: "DESC"
  }
})
export class CondicaoPagamentoVendaDraft {

  constructor(condicaoPagamentoVendaDraft: CondicaoPagamentoVendaDraft) {
    this.condicaoPagamento = condicaoPagamentoVendaDraft?.condicaoPagamento
    this.valor = condicaoPagamentoVendaDraft?.valor
    this.venda = condicaoPagamentoVendaDraft?.venda
  }

  @PrimaryGeneratedColumn({
    primaryKeyConstraintName: "pk_condicao_pagamento_venda_draft",
  })
  id?: number;

  @ManyToOne(() => CondicaoPagamento, {eager: true})
  @JoinColumn({
    name: "id_condicao_pagamento",
    foreignKeyConstraintName: "fk_condicao_pagamento_condicao_pagamento_venda_draft",
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

  @ManyToOne(() => VendaDraft, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({
    name: 'id_venda',
    foreignKeyConstraintName: 'fk_venda_condicao_pagamento_venda_draft',
  })
  venda: VendaDraft;

}
