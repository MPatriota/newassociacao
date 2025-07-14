import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Min } from "class-validator"

@Entity({
  orderBy: {
    id: "DESC"
  }
})
export class CondicaoPagamento {

  constructor(condicaoPagamento: CondicaoPagamento) {
    this.nome = condicaoPagamento?.nome;
    this.parcelas = condicaoPagamento?.parcelas;
    this.intervalo = condicaoPagamento?.intervalo;
    this.vencimento = condicaoPagamento?.vencimento;
    this.descricao = condicaoPagamento?.descricao;
    this.ativa = condicaoPagamento?.ativa;
    this.obrigadoInformarCliente = condicaoPagamento?.obrigadoInformarCliente;
    this.aVista = condicaoPagamento?.aVista;
  }

  @PrimaryGeneratedColumn({
    primaryKeyConstraintName: "pk_condicao_pagamento"
  })
  id?: number;

  @Column({
    type: 'varchar',
    length: 50
  })
  nome: string;

  @Column({
    type: "int"
  })
  @Min(1)
  parcelas: number;

  @Column({
    type: "int"
  })
  @Min(0)
  intervalo: number;

  @Column({
    type: "int"
  })
  @Min(0)
  vencimento: number;

  @Column({
    type: 'varchar',
    length: 200
  })
  descricao: string;

  @Column({
    type: 'boolean',
    default: true
  })
  ativa: boolean;

  @Column({
    type: 'boolean',
    default: false,
    name: 'obrigado_informar_cliente'
  })
  obrigadoInformarCliente: boolean;

  @Column({
    type: 'boolean',
    default: false,
    name: 'a_vista'
  })
  aVista: boolean;
}
