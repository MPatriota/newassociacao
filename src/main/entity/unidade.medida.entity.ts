import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'unidades_medida',
  orderBy: {
    id: "DESC"
  }
})
export class UnidadeMedida {

  @PrimaryGeneratedColumn({
    name: 'id_unidade_medida'
  })
  id!: number;

  @Column({ length: 50 })
  nome!: string;

  @Column({ length: 10 })
  sigla!: string;

  constructor(unidadeMedida: { id?: number, nome: string, sigla: string }) {
    this.nome = unidadeMedida?.nome;
    this.sigla = unidadeMedida?.sigla;
  }

}
