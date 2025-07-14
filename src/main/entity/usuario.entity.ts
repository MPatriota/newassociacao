import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  orderBy: {
    id: "DESC"
  }
})
export class Usuario {

  constructor(usuario: Usuario) {
    this.nome = usuario?.nome;
    this.senha = usuario?.senha;
    this.usuario = usuario?.usuario;
    this.primeiroAcessoRealizado = usuario?.primeiroAcessoRealizado;
  }

  @PrimaryGeneratedColumn({
    primaryKeyConstraintName: "pk_usuario"
  })
  id?: number;

  @Column({type: 'varchar', length: 100})
  nome: string;

  @Column({
    type: "varchar",
    length: 255,
    unique: true
  })
  usuario: string;

  @Column({
    type: 'varchar',
  })
  senha: String;

  @Column({
    name: 'primeiro_acesso_realizado',
    type: 'boolean',
    default: false
  })
  primeiroAcessoRealizado: Boolean;
}
