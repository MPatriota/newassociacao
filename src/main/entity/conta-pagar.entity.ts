import { AfterLoad, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { getColumnType } from "../util/typeorm";
import { Fornecedor } from "./fornecedor.entity";
import { EntradaEstoque } from './entrada-estoque.entity';
import { ForceToLoad } from '../annotation/force-to-load';
import { ContaPagarStatus } from '../enum/conta-pagar-status.enum';
import moment from 'moment';

@Entity({
  orderBy: {
    id: "DESC"
  }
})
export class ContaPagar {

  constructor(contaPagar: ContaPagar) {
    this.fornecedor = contaPagar?.fornecedor;
    this.valor = contaPagar?.valor;
    this.dataVencimento = contaPagar?.dataVencimento;
    this.entradaEstoque = contaPagar?.entradaEstoque;
    this.status = contaPagar?.status;
    this.paga = contaPagar?.paga;
    this.dataPagamento = contaPagar?.dataPagamento;
  }

  @PrimaryGeneratedColumn({
    primaryKeyConstraintName: "pk_conta_pagar"
  })
  id?: number;

  @JoinColumn({
    name: 'id_fornecedor',
    foreignKeyConstraintName: 'fk_fornecedor_conta_pagar'
  })
  @ManyToOne(() => Fornecedor, {
    eager: true
  })
  @ForceToLoad()
  fornecedor: Fornecedor;

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
    name: 'id_entrada_estoque',
    foreignKeyConstraintName: 'fk_entrada_estoque_conta_pagar',
  })
  @ManyToOne(() => EntradaEstoque, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  entradaEstoque: EntradaEstoque;

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

  status: ContaPagarStatus;

  @AfterLoad()
  defineStatus() {
    if(this.paga) {
      this.status = ContaPagarStatus.PAGA
    } else {
      const currentDate = moment();

      if(currentDate.isAfter(this.dataVencimento, "date")) {
        this.status = ContaPagarStatus.VENCIDA
      } else {
        this.status = ContaPagarStatus.ABERTA
      }

    }
  }
}
