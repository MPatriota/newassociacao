import { Entity, JoinColumn, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { FechamentoCaixa } from './fechamento-caixa.entity';
import { CondicaoPagamento } from './condicao-pagamento.entity';

@Entity({
  name: 'fechamento_caixa_razao',
  orderBy: {
    id: "DESC"
  }
})
export class FechamentoCaixaRazao {

  constructor(fechamentoCaixaRazao: FechamentoCaixaRazao) {
    this.fechamentoCaixa = fechamentoCaixaRazao?.fechamentoCaixa;
    this.valorRegistrado = fechamentoCaixaRazao?.valorRegistrado;
    this.valorContado = fechamentoCaixaRazao?.valorContado;
    this.condicaoPagamento = fechamentoCaixaRazao?.condicaoPagamento;
  }

  @PrimaryGeneratedColumn({
    primaryKeyConstraintName: "pk_fechamento_caixa_razao"
  })
  id?: number;

  @ManyToOne(
    () => FechamentoCaixa,
    fechamentoCaixa => fechamentoCaixa.razoes,
    {
      onDelete: 'CASCADE',
      orphanedRowAction: 'delete',
    })
  @JoinColumn({
    name: 'id_fechamento_caixa',
    foreignKeyConstraintName: 'fk_fechamento_caixa_fechamento_caixa_razao'
  })
  fechamentoCaixa: FechamentoCaixa;

  @Column({
    name: 'valor_registrado',
    type: 'decimal',
    precision: 10,
    scale: 2
  })
  valorRegistrado: number;

  @Column({
    name: 'valor_contado',
    type: 'decimal',
    precision: 10,
    scale: 2
  })
  valorContado: number;

  @ManyToOne(() => CondicaoPagamento)
  @JoinColumn({
    name: 'id_condicao_pagamento',
    foreignKeyConstraintName: 'fk_condicao_pagamento_fechamento_caixa_razao'
  })
  condicaoPagamento: CondicaoPagamento;

  get diferenca() {
    return this.valorRegistrado - this.valorContado;
  }
}
