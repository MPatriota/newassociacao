import { Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Cliente } from './cliente.entity';
import { ForceToLoad } from '../annotation/force-to-load';
import { VendaItemDraft } from './venda-item-draft.entity';

@Entity({
  orderBy: {
    id: "DESC"
  }
})
export class VendaDraft {

  constructor(vendaDraft: VendaDraft) {
    this.id = vendaDraft?.id;
    this.cliente = vendaDraft?.cliente;
    this.items = vendaDraft?.items;
  }

  @PrimaryColumn({
    primaryKeyConstraintName: "pk_venda_draft",
  })
  id?: number;

  @ManyToOne(() => Cliente, {eager: true})
  @JoinColumn({
    name: "id_cliente",
    foreignKeyConstraintName: "fk_cliente_venda_draft",
  })
  @ForceToLoad()
  cliente: Cliente;

  @OneToMany(() => VendaItemDraft, vendaItemDraft => vendaItemDraft.vendaDraft, {
    cascade: true,
    eager: true
  })
  @ForceToLoad()
  items: VendaItemDraft[];

}
