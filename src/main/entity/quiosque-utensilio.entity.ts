import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Quiosque } from './quiosque.entity';
import { Utensilio } from './utensilio.entity';
import { ForceToLoad } from '../annotation/force-to-load';
import { Min } from 'class-validator';

@Entity({
  name: 'quiosque_utensilio',
  orderBy: {
    id: "DESC"
  }
})
export class QuiosqueUtensilio {

  @PrimaryGeneratedColumn()
  id!: number;

  @JoinColumn({ name: 'quiosqueId' })
  @ManyToOne(() => Quiosque, (quiosque) => quiosque.utensilios, { onDelete: 'CASCADE', orphanedRowAction: 'delete' })
  quiosque!: Quiosque;

  @ForceToLoad()
  @ManyToOne(() => Utensilio, { onDelete: 'CASCADE', orphanedRowAction: 'delete', eager: true })
  utensilio!: Utensilio;

  @Column({
    type: "int",
    default: 0,
    nullable: false
  })
  quantidade!: number;

}
