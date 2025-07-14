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
export class Configuracao {

  constructor(configuracao: Configuracao) {
    this.gerarComprovanteVenda = configuracao?.gerarComprovanteVenda;
  }

  @PrimaryGeneratedColumn({
    primaryKeyConstraintName: "pk_configuracao"
  })
  id?: number;

  @Column({
    name: 'gerar_comprovante_venda',
    type: 'boolean',
    default: false
  })
  gerarComprovanteVenda: boolean;

}
