import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TipoProduto } from './enums/tipo-produto';
import { UnidadeMedida } from './unidade.medida.entity';
import { ProdutoTag } from './produto-tag.entity';
import { getColumnType } from '../util/typeorm';
import { ForceToLoad } from '../annotation/force-to-load';

@Entity({
  name: 'produto',
  orderBy: {
    id: "DESC"
  }
})
export class Produto {

  @PrimaryGeneratedColumn({
    primaryKeyConstraintName: 'pk_produto'
  })
  id!: number;

  @Column({
    type: 'text',
    nullable: true
  })
  imagem?: string | null;

  @Column({
    length: 100,
    nullable: false,
    unique: true
  })
  nome!: string;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    nullable: false
  })
  valor!: number;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    nullable: false
  })
  custo!: number;

  @Column({
    enum: TipoProduto,
    enumName: 'tipo_produto',
    nullable: false
  })
  tipo!: TipoProduto;

  @Column('int')
  estoque!: number;

  @Column('int')
  estoqueMinimo!: number;

  @Column({
    length: 500,
    nullable: true
  })
  anotacoes?: string;

  @Column({
    length: 50,
    nullable: true,
    unique: true
  })
  codigoBarras?: string;

  @ManyToOne(() => UnidadeMedida, { cascade: true })
  @JoinColumn({ name: 'unidade_medida_id', foreignKeyConstraintName: 'fk_produto_unidade_medida' })
  unidadeMedida!: UnidadeMedida;

  @ForceToLoad()
  @OneToMany(() => ProdutoTag, (produtoTag) => produtoTag.produto, { cascade: true,  eager: true, orphanedRowAction: 'delete' })
  tags!: ProdutoTag[];

  @Column({ type: getColumnType('timestamp', 'datetime'), default: () => 'CURRENT_TIMESTAMP', update: false })
  dataCadastro!: Date;

  constructor(produto: {
    nome: string;
    valor: number;
    custo: number;
    tipo: TipoProduto;
    estoque: number;
    estoqueMinimo: number;
    tags: ProdutoTag[];
    unidadeMedida: UnidadeMedida,
    imagem: string,
  }) {
    this.nome = produto?.nome;
    this.valor = produto?.valor;
    this.custo = produto?.custo;
    this.tipo = produto?.tipo;
    this.estoque = produto?.estoque;
    this.estoqueMinimo = produto?.estoqueMinimo;
    this.unidadeMedida = produto?.unidadeMedida;
    this.tags = produto?.tags;
    this.imagem = produto?.imagem;
  }

}
