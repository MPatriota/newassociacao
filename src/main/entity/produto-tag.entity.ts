import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Produto } from './produto.entity';
import { Tag } from './tag.entity';
import { ForceToLoad } from '../annotation/force-to-load';

@Entity({
  name: 'produto_tag',
  orderBy: {
    id: "DESC"
  }
})
export class ProdutoTag {

  @PrimaryGeneratedColumn()
  id!: number;

  @ForceToLoad()
  @ManyToOne(() => Tag, (tag) => tag.id, { eager: true })
  @JoinColumn({ name: 'tag_id' })
  tag!: Tag;

  @ManyToOne(() => Produto, (produto) => produto.tags, { onDelete: 'CASCADE', orphanedRowAction: 'delete' })
  @JoinColumn({ name: 'produto_id', foreignKeyConstraintName: 'fk_produto_tag_produto' })
  produto!: Produto | undefined;

  constructor(produtoTag: { id?: number, tag: Tag, produto: Produto | undefined }) {
    this.tag = produtoTag?.tag;
    this.produto = produtoTag?.produto
  }

}
