import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ColumnNumericTransformer, getColumnType } from '../util/typeorm';

@Entity({
  name: 'abertura_caixa',
  orderBy: {
    id: "DESC"
  }
})
export class AberturaCaixa {

  constructor(aberturaCaixa: AberturaCaixa) {
    this.id = aberturaCaixa?.id;
    this.saldoCaixa = aberturaCaixa?.saldoCaixa;
  }

  @PrimaryGeneratedColumn({
    primaryKeyConstraintName: "pk_abertura_caixa"
  })
  id?: number;

  @Column({
    name: 'saldo_caixa',
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumericTransformer()
  })
  saldoCaixa: number;

  @Column({
    type: getColumnType('timestamp', 'datetime'),
    default: () => 'CURRENT_TIMESTAMP',
    update: false,
    name: 'data_cadastro'
  })
  dataCadastro!: Date;
}
