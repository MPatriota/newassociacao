import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ForceToLoad } from '../annotation/force-to-load';
import { Quiosque } from './quiosque.entity';
import { Cliente } from './cliente.entity';
import { getColumnType } from '../util/typeorm';
import { ContaPagar } from './conta-pagar.entity';
import { ContaReceber } from './conta-receber.entity';

@Entity({
  name: 'agendamento_quiosque',
  orderBy: {
    id: "DESC"
  }
})
export class AgendamentoQuiosque {

  constructor(agendamentoQuiosque: AgendamentoQuiosque) {
    this.id = agendamentoQuiosque?.id;
    this.quiosque = agendamentoQuiosque?.quiosque;
    this.cliente = agendamentoQuiosque?.cliente;
    this.data = agendamentoQuiosque?.data;
    this.horaInicio = agendamentoQuiosque?.horaInicio;
    this.horaFim = agendamentoQuiosque?.horaFim;
    this.valor = agendamentoQuiosque?.valor;
    this.descricao = agendamentoQuiosque?.descricao;
    this.contasReceber = agendamentoQuiosque?.contasReceber;
  }

  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Quiosque, {
    eager: true,
    nullable: false
  })
  @JoinColumn({
    name: "id_quiosque",
    foreignKeyConstraintName: "fk_quiosque_agendamento_quiosque",
  })
  @ForceToLoad()
  quiosque: Quiosque;

  @ManyToOne(() => Cliente, {
    eager: true,
    nullable: false
  })
  @JoinColumn({
    name: "id_cliente",
    foreignKeyConstraintName: "fk_cliente_agendamento_quiosque",
  })
  @ForceToLoad()
  cliente: Cliente;

  @Column({
    type: getColumnType('date', 'datetime'),
    default: () => 'CURRENT_TIMESTAMP',
    name: 'data',
  })
  data: Date;

  @Column({
    type: "time",
    name: "hora_inicio"
  })
  horaInicio: string;

  @Column({
    type: "time",
    name: "hora_fim"
  })
  horaFim: string;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 2
  })
  valor: number;

  @Column({
    nullable: true
  })
  descricao: string;

  @OneToMany(() => ContaReceber, contaReceber => contaReceber.agendamentoQuiosque, {
    cascade: true,
    eager: true
  })
  @ForceToLoad()
  contasReceber: ContaReceber[];
}
