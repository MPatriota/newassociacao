import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Quiosque } from './quiosque.entity';
import { ForceToLoad } from '../annotation/force-to-load';

@Entity({
  name: 'quiosque_imagem',
  orderBy: {
    id: "DESC"
  }
})
export class QuiosqueImagem {

  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Quiosque, (quiosque) => quiosque.utensilios, { onDelete: 'CASCADE', orphanedRowAction: 'delete' })
  quiosque!: Quiosque;

  @Column({
    type: 'text',
    nullable: true
  })
  imagem?: string | null;

}
