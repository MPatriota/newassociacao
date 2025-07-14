import { Injectable } from '../annotation/injectable';
import { AbstractRepository } from './repository';
import { Tag } from '../entity/tag.entity';

@Injectable()
export class TagRepository extends AbstractRepository<Tag> {

  constructor() {
    super(Tag);
  }

  override async delete(id: number | string): Promise<void> {
    await this.repository.softDelete(id);
  }

  async findBySlug(slug: string): Promise<Tag | null> {
    return this.repository.findOne({
      withDeleted: true,
      where: { slug }
    });
  }

  async restore(id: number) {
    await this.repository.restore(id);
  }

  async findTagsFromCantina() {
    return await this.repository
      .createQueryBuilder('t')
      .innerJoin('produto_tag', 'pt', 't.id = pt.tag_id')
      .innerJoin('produto', 'p', 'p.id = pt.produto_id')
      .where('p.tipo = :tipo', { tipo: 'CANTINA' })
      .getMany();
  }

}
