import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Venda } from './venda.entity';
import { Produto } from './produto.entity';

@Entity({
  orderBy: {
    id: "DESC"
  }
})
export class VendaItem {

  constructor(vendaItem: VendaItem) {
    this.venda = vendaItem?.venda;
    this.produto = vendaItem?.produto;
    this.valor = vendaItem?.valor;
    this.quantidade = vendaItem?.quantidade;
    this.subtotal = vendaItem?.subtotal;
  }

  @PrimaryGeneratedColumn({
    primaryKeyConstraintName: "pk_venda_item",
  })
  id?: number;

  @ManyToOne(() => Produto, {eager: true})
  @JoinColumn({
    name: 'id_produto',
    foreignKeyConstraintName: "fk_produto_venda_item",
  })
  produto: Produto;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2
  })
  valor: number;

  @Column({
    type: "int"
  })
  quantidade: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2
  })
  subtotal: number;

  @ManyToOne(() => Venda, {
      onDelete: 'CASCADE',
      orphanedRowAction: 'delete'
  })
  @JoinColumn({
    name: 'id_venda',
    foreignKeyConstraintName: "fk_venda_venda_item"
  })
  venda: Venda;

}
