import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Usuario } from "./usuario.entity";
import { ForceToLoad } from '../annotation/force-to-load';

@Entity({
  orderBy: {
    id: "DESC"
  }
})
export class Notification {

  @PrimaryGeneratedColumn({
    primaryKeyConstraintName: "pk_notification"
  })
  id?: number;

  @Column({
    type: 'varchar',
    nullable: false,
    name: 'title'
  })
  title: string;

  @Column({
    type: 'varchar',
    nullable: false,
    name: 'description'
  })
  description: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt!: Date;

  @Column({
    type: 'boolean',
    default: false,
  })
  read: boolean = false;

  @Column({
    type: 'boolean',
    default: false,
  })
  received: boolean = false;

  @Column({
    type: 'varchar',
    nullable: true
  })
  icon: string = 'pi-bell'

  @JoinColumn({
    name: 'id_usuario',
    foreignKeyConstraintName: 'fk_usuario',
  })
  @ManyToOne(() => Usuario, {
    nullable: false,
    eager: true,
  })
  @ForceToLoad()
  usuario!: Usuario;

  constructor(title: string, description: string, icon: string) {
    this.title = title;
    this.description = description;
    this.icon = icon;
  }

}

