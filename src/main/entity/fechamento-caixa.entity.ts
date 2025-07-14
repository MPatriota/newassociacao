import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ForceToLoad } from "../annotation/force-to-load";
import { getColumnType } from '../util/typeorm';
import { AberturaCaixa } from './abertura-caixa.entity';
import { FechamentoCaixaRazao } from './fechamento-caixa-razao.entity';

@Entity({
  name: 'fechamento_caixa',
  orderBy: {
    id: "DESC"
  }
})
export class FechamentoCaixa {

  constructor(fechamentoCaixa: FechamentoCaixa) {
    this.razoes = fechamentoCaixa?.razoes;
    this.aberturaCaixa = fechamentoCaixa?.aberturaCaixa;
  }

  @PrimaryGeneratedColumn({
    primaryKeyConstraintName: "pk_fechamento_caixa"
  })
  id?: number;

  @Column({
    type: getColumnType('timestamp', 'datetime'),
    default: () => 'CURRENT_TIMESTAMP',
    update: false,
    name: 'data_cadastro'
  })
  dataCadastro!: Date;

  @OneToMany(() => FechamentoCaixaRazao,
    fechamentoCaixaRazao => fechamentoCaixaRazao.fechamentoCaixa,
    {
      cascade: true,
      eager: true
    })
  @ForceToLoad()
  razoes: FechamentoCaixaRazao[];

  @OneToOne(() => AberturaCaixa)
  @JoinColumn({
    name: 'id_abertura_caixa',
    foreignKeyConstraintName: 'fk_abertura_caixa_fechamento_caixa'
  })
  aberturaCaixa: AberturaCaixa;

}
