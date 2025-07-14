import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import { Min } from "class-validator"
import { Produto } from "./produto.entity";
import { ForceToLoad } from "../annotation/force-to-load";
import { getColumnType } from "../util/typeorm";
import { EntradaEstoqueTipoEnum } from "../enum/entrada-estoque-tipo.enum";
import { Fornecedor } from "./fornecedor.entity";
import {ContaPagar} from './conta-pagar.entity';

@Entity({
  orderBy: {
    id: "DESC"
  }
})
export class EntradaEstoque {

  constructor(entradaEstoque: EntradaEstoque) {
    this.produto = entradaEstoque?.produto
    this.quantidade = entradaEstoque?.quantidade
    this.valor = entradaEstoque?.valor
    this.subtotal = entradaEstoque?.subtotal
    this.requisitante = entradaEstoque?.requisitante
    this.observacao = entradaEstoque?.observacao
    this.dataCadastro = entradaEstoque?.dataCadastro
    this.fornecedor = entradaEstoque?.fornecedor
    this.tipo = entradaEstoque?.tipo
    this.contasPagar = entradaEstoque?.contasPagar
  }

  @PrimaryGeneratedColumn({
    primaryKeyConstraintName: "pk_entrada_estoque"
  })
  id?: number;

  @JoinColumn({
    foreignKeyConstraintName: 'fk_produto_entrada_estoque',
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
    type: "decimal",
    precision: 10,
    scale: 2
  })
  valor: number;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 2
  })
  subtotal: number;

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

  @ManyToOne(() => Fornecedor, {
    nullable: true,
    eager: true
  })
  @JoinColumn({
    name: 'id_fornecedor',
    foreignKeyConstraintName: 'fk_fornecedor_entrada_estoque'
  })
  fornecedor?: Fornecedor;

  @Column({
    enum: EntradaEstoqueTipoEnum,
    name: 'entrada_estoque_tipo'
  })
  tipo: EntradaEstoqueTipoEnum;

  @OneToMany(() => ContaPagar, contaPagar => contaPagar.entradaEstoque, {
    cascade: true,
    eager: true
  })
  @ForceToLoad()
  contasPagar: ContaPagar[];
}
