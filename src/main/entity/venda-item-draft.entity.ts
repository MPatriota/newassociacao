import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Produto } from './produto.entity';
import { VendaDraft } from './venda-draft.entity';
import { ForceToLoad } from '../annotation/force-to-load';

@Entity({
  orderBy: {
    id: "DESC"
  }
})
export class VendaItemDraft {

  constructor(vendaItemDraft: VendaItemDraft) {
    this.vendaDraft = vendaItemDraft?.vendaDraft;
    this.produto = vendaItemDraft?.produto;
    this.quantidade = vendaItemDraft?.quantidade;
  }

  @PrimaryGeneratedColumn({
    primaryKeyConstraintName: "pk_venda_item_draft",
  })
  id?: number;

  @ManyToOne(() => Produto, {eager: true})
  @JoinColumn({
    name: 'id_produto',
    foreignKeyConstraintName: "fk_produto_venda_item_draft",
  })
  @ForceToLoad()
  produto: Produto;

  @Column({
    type: "int"
  })
  quantidade: number;

  @ManyToOne(() => VendaDraft, {
      onDelete: 'CASCADE',
      orphanedRowAction: 'delete'
  })
  @JoinColumn({
    name: 'id_venda_draft',
    foreignKeyConstraintName: "fk_venda_venda_item_draft"
  })
  vendaDraft: VendaDraft;

}
