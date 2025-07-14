import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  orderBy: {
    id: "DESC"
  }
})
export class Endereco {

  constructor(endereco: Endereco) {
    this.id = endereco?.id;
    this.cep = endereco?.cep;
    this.logradouro = endereco?.logradouro;
    this.numero = endereco?.numero;
    this.bairro = endereco?.bairro;
    this.cidade = endereco?.cidade;
    this.estado = endereco?.estado;
  }

  @PrimaryGeneratedColumn()
  id?: number;

  @Column({type: 'varchar', length: 8})
  cep: string;

  @Column({type: 'varchar', length: 150})
  logradouro: string;

  @Column({type: 'varchar', length: 10})
  numero: string;

  @Column({type: 'varchar', length: 100})
  bairro: string;

  @Column()
  cidade: string;

  @Column()
  estado: string;

}
