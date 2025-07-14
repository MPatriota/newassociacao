import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Endereco } from './endereco.entity';
import { IsEmail,  } from "class-validator"
import { DocumentoTipoEnum } from "../enum/documento-tipo.enum";
import { CondicaoPagamento } from "./condicao-pagamento.entity";
import { ForceToLoad } from "../annotation/force-to-load";

@Entity({
  orderBy: {
    id: "DESC"
  }
})
export class Fornecedor {

  constructor(fornecedor: Fornecedor) {
    this.nome = fornecedor?.nome;
    this.endereco = fornecedor?.endereco;
    this.documento = fornecedor?.documento;
    this.email = fornecedor?.email;
    this.responsavel = fornecedor?.responsavel;
    this.telefone = fornecedor?.telefone;
    this.documentoTipo = fornecedor?.documentoTipo;
    this.condicaoPagamento = fornecedor?.condicaoPagamento;
  }

  @PrimaryGeneratedColumn({
    primaryKeyConstraintName: "pk_fornecedor"
  })
  id?: number;

  @Column({
    type: 'varchar'
  })
  nome: string;

  @OneToOne(() => Endereco, {
    cascade: true,
    eager: true
  })
  @JoinColumn({
    name: 'id_endereco',
    foreignKeyConstraintName: 'fk_endereco_fornecedor',
  })
  endereco: Endereco;

  @Column({
    enum: DocumentoTipoEnum,
    name: 'documento_tipo'
  })
  documentoTipo: DocumentoTipoEnum;

  @Column({
    type: "varchar",
    unique: true
  })
  documento: string;

  @Column({
    type: "varchar",
    nullable: true,
  })
  responsavel: string;

  @Column({
    type: "varchar",
    unique: true,
    nullable: true
  })
  @IsEmail()
  email: string;

  @Column({
    type: "varchar",
  })
  telefone: string;

  @ManyToOne(() => CondicaoPagamento, {eager: true})
  @JoinColumn({
    name: 'id_condicao_pagamento',
    foreignKeyConstraintName: 'fk_condicao_pagamento_fornecedor'
  })
  @ForceToLoad()
  condicaoPagamento: CondicaoPagamento
}
