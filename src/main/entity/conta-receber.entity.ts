import { AfterLoad, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { getColumnType } from "../util/typeorm";
import { Cliente } from './cliente.entity';
import { Venda } from './venda.entity';
import moment from 'moment/moment';
import { ContaReceberStatus } from '../enum/conta-receber-status.enum';
import { ForceToLoad } from '../annotation/force-to-load';
import { EntradaEstoque } from './entrada-estoque.entity';
import { AgendamentoQuiosque } from './agendamento-quiosque.entity';

@Entity({
  orderBy: {
    id: "DESC"
  }
})
export class ContaReceber {

  constructor(contaReceber: ContaReceber) {
    this.cliente = contaReceber?.cliente;
    this.valor = contaReceber?.valor;
    this.dataVencimento = contaReceber?.dataVencimento;
    this.venda = contaReceber?.venda;
    this.paga = contaReceber?.paga;
    this.status = contaReceber?.status;
    this.dataPagamento = contaReceber?.dataPagamento;
    this.descricao = contaReceber?.descricao;
    this.agendamentoQuiosque = contaReceber?.agendamentoQuiosque;
  }

  @PrimaryGeneratedColumn({
    primaryKeyConstraintName: "pk_conta_receber"
  })
  id?: number;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 2
  })
  valor: number;

  @Column({
    type: getColumnType('date', 'datetime'),
    default: () => 'CURRENT_TIMESTAMP',
    name: 'data_vencimento'
  })
  dataVencimento: Date;

  @JoinColumn({
    name: 'id_cliente',
    foreignKeyConstraintName: 'fk_cliente_conta_receber'
  })
  @ManyToOne(() => Cliente, {
    nullable: false,
    eager: true
  })
  @ForceToLoad()
  cliente: Cliente;

  @JoinColumn({
    name: 'id_venda',
    foreignKeyConstraintName: 'fk_venda_conta_receber',
  })
  @ManyToOne(() => Venda, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  venda: Venda;

  @Column({
    type: 'boolean',
    default: false
  })
  paga: boolean;

  @Column({
    type: getColumnType('date', 'datetime'),
    name: 'data_pagamento',
    nullable: true
  })
  dataPagamento: Date;

  @Column({
    nullable: true
  })
  descricao: string;

  @JoinColumn({
    name: 'id_agendamento_quiosque',
    foreignKeyConstraintName: 'fk_agendamento_quiosque_conta_receber',
  })
  @ManyToOne(() => AgendamentoQuiosque, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  agendamentoQuiosque: AgendamentoQuiosque;


  status: ContaReceberStatus;

  @AfterLoad()
  defineStatus() {
    if(this.paga) {
      this.status = ContaReceberStatus.PAGA
    } else {
      const currentDate = moment();

      if(currentDate.isAfter(this.dataVencimento, "date")) {
        this.status = ContaReceberStatus.VENCIDA
      } else {
        this.status = ContaReceberStatus.ABERTA
      }

    }
  }
}
