import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import { Min } from "class-validator"
import { Produto } from "./produto.entity";
import { ForceToLoad } from "../annotation/force-to-load";
import { getColumnType } from "../util/typeorm";

@Entity({
  orderBy: {
    id: "DESC"
  }
})
export class SaidaEstoque {

  constructor(saidaEstoque: SaidaEstoque) {
    this.produto = saidaEstoque?.produto;
    this.quantidade = saidaEstoque?.quantidade;
    this.observacao = saidaEstoque?.observacao;
  }

  @PrimaryGeneratedColumn({
    primaryKeyConstraintName: "pk_saida_estoque"
  })
  id?: number;

  @JoinColumn({
    foreignKeyConstraintName: 'fk_produto_saida_estoque',
    name: 'id_produto'
  })
  @ManyToOne(() => Produto, {
    eager: true
  })
  @ForceToLoad()
  produto: Produto;

  @Column({
    type: "int"
  })
  @Min(1)
  quantidade: number;

  @Column({
    type: "varchar",
    length: 100,
    nullable: true
  })
  requisitante?: string;

  @Column({
    type: "varchar",
    length: 500,
    nullable: true
  })
  observacao: string;

  @Column({
    type: getColumnType('timestamp', 'datetime'),
    default: () => 'CURRENT_TIMESTAMP',
    update: false,
    name: 'data_cadastro'
  })
  dataCadastro!: Date;
}
