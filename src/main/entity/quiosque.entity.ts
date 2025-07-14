import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { QuiosqueUtensilio } from './quiosque-utensilio.entity';
import { QuiosqueImagem } from './quiosque-imagens.entity';
import { ForceToLoad } from '../annotation/force-to-load';

@Entity({
  name: 'quiosque',
  orderBy: {
    id: "DESC"
  }
})
export class Quiosque {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    length: 50,
    unique: true
  })
  nome!: string;

  @Column()
  capacidadeMaxima!: number;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    nullable: false
  })
  valorAluguel!: number;

  @Column({
    nullable: true
  })
  descricao!: string;

  @Column()
  status: boolean = false;

  @Column({
    default: false
  })
  salao: boolean = false;

  @ForceToLoad()
  @OneToMany(() => QuiosqueUtensilio, (quiosqueUtensilios) => quiosqueUtensilios.quiosque, {
    cascade: true,
    eager: true,
    orphanedRowAction: 'delete'
  })
  utensilios!: QuiosqueUtensilio[];

  @ForceToLoad()
  @OneToMany(() => QuiosqueImagem, (quiosqueImagem) => quiosqueImagem.quiosque, {
    cascade: true,
    eager: true,
    orphanedRowAction: 'delete'
  })
  imagens!: QuiosqueImagem[];


  constructor(id: number, nome: string, capacidadeMaxima: number, valorAluguel: number, descricao: string, status: boolean, salao: boolean) {
    this.id = id;
    this.nome = nome;
    this.capacidadeMaxima = capacidadeMaxima;
    this.valorAluguel = valorAluguel;
    this.descricao = descricao;
    this.status = status;
    this.salao = salao;
  }

}
