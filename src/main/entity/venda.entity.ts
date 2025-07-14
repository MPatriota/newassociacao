import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Cliente } from './cliente.entity';
import { ForceToLoad } from '../annotation/force-to-load';
import { VendaItem } from './venda-item.entity';
import { CondicaoPagamento } from './condicao-pagamento.entity';
import { ContaReceber } from './conta-receber.entity';
import { ColumnNumericTransformer, getColumnType } from '../util/typeorm';
import { AberturaCaixa } from './abertura-caixa.entity';
import { CondicaoPagamentoVenda } from './condicao-pagamento-venda.entity';

@Entity({
  orderBy: {
    id: "DESC"
  }
})
export class Venda {

  constructor(venda: Venda) {
    this.cliente = venda?.cliente;
    this.items = venda?.items;
    this.total = venda?.total;
    this.contasReceber = venda?.contasReceber;
    this.createdAt = venda?.createdAt;
    this.aberturaCaixa = venda?.aberturaCaixa;
    this.condicoesPagamento = venda?.condicoesPagamento;
  }

  @PrimaryGeneratedColumn({
    primaryKeyConstraintName: "pk_venda",
  })
  id?: number;

  @ManyToOne(() => Cliente, {eager: true})
  @JoinColumn({
    name: "id_cliente",
    foreignKeyConstraintName: "fk_cliente_venda",
  })
  @ForceToLoad()
  cliente: Cliente;

  @OneToMany(() => VendaItem, vendaItem => vendaItem.venda, {
    cascade: true,
    eager: true
  })
  items: VendaItem[];

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumericTransformer()
  })
  total: number;

  @OneToMany(() => ContaReceber, contaReceber => contaReceber.venda, {
    cascade: true,
    eager: true
  })
  @ForceToLoad()
  contasReceber: ContaReceber[];

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @ManyToOne(() => AberturaCaixa)
  @JoinColumn({
    name: 'id_abertura_caixa',
    foreignKeyConstraintName: 'fk_abertura_caixa_venda',
  })
  aberturaCaixa: AberturaCaixa;

  @OneToMany(() => CondicaoPagamentoVenda, condicaoPagamentoVenda => condicaoPagamentoVenda.venda, {
    cascade: true,
    eager: true
  })
  @ForceToLoad()
  condicoesPagamento: CondicaoPagamentoVenda;

}
