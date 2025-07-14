import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Endereco } from './endereco.entity';
import { Dependente } from './dependente.entity';
import { ForceToLoad } from "../annotation/force-to-load";
import { IsEmail } from "class-validator"

@Entity({
  orderBy: {
    id: "DESC"
  }
})
export class Cliente {

  constructor(cliente: Cliente) {
    this.nome = cliente?.nome;
    this.endereco = cliente?.endereco;
    this.matricula = cliente?.matricula;
    this.foto = cliente?.foto;
    this.limiteCompra = cliente?.limiteCompra;
    this.dependentes = cliente?.dependentes;
    this.email = cliente?.email;
  }

  @PrimaryGeneratedColumn({
    primaryKeyConstraintName: "pk_cliente"
  })
  id?: number;

  @Column({type: 'varchar', length: 100})
  nome: string;

  @OneToOne(() => Endereco, {
    cascade: true,
    eager: true
  })
  @JoinColumn({
    name: 'id_endereco',
    foreignKeyConstraintName: 'fk_endereco_cliente',
  })
  @ForceToLoad()
  endereco: Endereco;

  @Column({
    type: 'varchar',
    length: 10,
    unique: true
  })
  matricula: string;

  @Column({
    type: 'text',
    nullable: true
  })
  foto: string;

  @Column({
    name: "limite_compra",
    type: 'decimal',
    precision: 10,
    scale: 2
  })
  limiteCompra: number;

  @OneToMany(() => Dependente, dependente => dependente.cliente, {
    cascade: true,
    eager: true
  })
  @ForceToLoad()
  dependentes: Dependente[];

  @Column({
    type: "varchar",
    length: 255,
    unique: true
  })
  email: string;
}
