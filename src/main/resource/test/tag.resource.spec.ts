import { DependencyContainer } from '../../configuration/dependency-container';
import { TagResource } from '../tag.resource';
import { DatabaseAccessor } from '../../configuration/database-accessor';
import { DataSource } from 'typeorm';
import { Tag } from '../../entity/tag.entity';

describe('TagResource', () => {

  let tagResource: TagResource;
  let dataSource: DataSource;

  beforeAll(async () => {
    dataSource = await DatabaseAccessor.getDataSource().initialize();
  })

  beforeEach(async () => {
    await dataSource.manager.delete('tag', {});
    tagResource = DependencyContainer.getInstance().resolve(TagResource);
  });

  afterAll(() => dataSource.destroy());

  it('should be defined', async () => {
    expect(tagResource).toBeDefined();
  });

  it('should return save', async () => {

    await tagResource.save({ name: 'tag', color: '#fffff' });

    const tagSaved = await tagResource.findById(1);

    expect(tagSaved).not.toBeNull();

  });

  it('should return findAll', async () => {

    for (let index = 0; index < 10; index++) {
      await tagResource.save({ name: 'tag' + index, color: '#fffff' });
    }

    const tags = await tagResource.findAll(1, 5);

    expect(tags.content.length).toBe(5);
    expect(tags.content[0].name).toBe('tag9');
    expect(tags.totalPages).toBe(2)

  });

  it('should filter on findAll', async () => {

    for (let index = 0; index < 10; index++) {
      await tagResource.save({ name: 'tag' + index, color: '#fffff' });
    }

    const tags = await tagResource.findAll(1, 10, 'slug=like=tag1*');

    expect(tags.content.length).toBe(1);
    expect(tags.content[0].name).toBe('tag1');

  });

  it('should find by slug', async () => {

    for (let index = 0; index < 10; index++) {
      await tagResource.save({ name: 'Maçã' + index, color: '#fffff' });
    }

    const tag = await tagResource.findBySlug('maca1');

    expect(tag).not.toBeNull();

  });

  it('should return soft delete', async () => {

    await dataSource.manager.save(Tag, { id: 99999, name: 'tag', color: '#fffff', slug: 'tag' });

    await tagResource.delete(99999);

    const tag = await tagResource.findById(99999);

    expect(tag).not.toBeNull();


  });

  it('should return update', async () => {

    const tagSaved = await tagResource.save({ name: 'tag', color: '#fffff' });

    await tagResource.update(tagSaved?.id || 0, [
      {
        op: 'replace',
        path: '/name',
        value: 'tag updated'
      }
    ]);

    const tag = await tagResource.findById(tagSaved?.id || 0);

    expect(tag).not.toBeNull();
    expect(tag?.name).toBe('tag updated');

  });

});
