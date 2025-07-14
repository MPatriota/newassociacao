import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Associacao {

  constructor(associacao: Associacao) {
    this.nomeRazao = associacao?.nomeRazao;
    this.nomeFantasia = associacao?.nomeFantasia;
    this.endereco = associacao?.endereco;
    this.telefone = associacao?.telefone;
  }

  @PrimaryGeneratedColumn({
    primaryKeyConstraintName: "pk_associacao"
  })
  id?: number;

  @Column({
    type: 'varchar',
    name: 'nome_razao',
  })
  nomeRazao: string;

  @Column({
    type: 'varchar',
    name: 'nome_fantasia',
  })
  nomeFantasia: string;

  @Column({
    type: 'varchar',
  })
  endereco: string;

  @Column({
    type: 'varchar',
  })
  telefone: string;
}
