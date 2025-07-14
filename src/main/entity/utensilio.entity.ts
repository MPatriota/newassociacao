import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'utensilio',
  orderBy: {
    id: "DESC"
  }
})
export class Utensilio {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    length: 50,
    nullable: false,
    unique: true
  })
  nome!: string;

}
