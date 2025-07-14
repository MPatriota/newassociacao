import { BeforeInsert, BeforeUpdate, Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  orderBy: {
    id: "DESC"
  }
})
export class Tag {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  slug!: string;

  @Column()
  name: string;

  @Column()
  color: string;

  @DeleteDateColumn()
  deletedAt?: Date;

  constructor(tag: { id?: number, name: string, color: string }) {
    this.name = tag?.name;
    this.color = tag?.color;
  }

  @BeforeInsert()
  @BeforeUpdate()
  normalizeSlug() {
    if (this.name) {
      this.slug = this.name
        .normalize('NFD')
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
    }
  }

}
