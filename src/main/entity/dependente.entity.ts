import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Cliente } from './cliente.entity';

@Entity({
  orderBy: {
    id: "DESC"
  }
})
export class Dependente {

  constructor(dependente: Dependente) {
    this.nome = dependente?.nome;
    this.cliente = dependente?.cliente;
  }

  @PrimaryGeneratedColumn({
    primaryKeyConstraintName: "pk_dependente",
  })
  id?: number;

  @Column({type: 'varchar', length: 100})
  nome: string;

  @ManyToOne(
      () => Cliente,
      cliente => cliente.dependentes,
      {
        onDelete: 'CASCADE',
        orphanedRowAction: 'delete',
      })
  @JoinColumn({
    name: 'id_cliente',
    foreignKeyConstraintName: 'fk_cliente_dependente'
  })
  cliente?: Cliente;
}
