import { DataSource } from 'typeorm';
import { QuiosqueResource } from '../quiosque.resource';
import { QuiosqueRepository } from '../../repository/quiosque.repository';
import { DatabaseAccessor } from '../../configuration/database-accessor';
import { Utensilio } from '../../entity/utensilio.entity';
import { Quiosque } from '../../entity/quiosque.entity';
import { QuiosqueUtensilio } from '../../entity/quiosque-utensilio.entity';
import { QuiosqueImagem } from '../../entity/quiosque-imagens.entity';
import { Produto } from '../../entity/produto.entity';
import { DependencyContainer } from '../../configuration/dependency-container';
import { ProdutoResource } from '../produto.resource';
import { TagRepository } from '../../repository/tag.repository';

async function createSingleQuiosque(id: number, repository: QuiosqueRepository, datasource: DataSource) {

  const quiosque = new Quiosque(
    id,
    'foo ' + id,
    20,
    100,
    'foo',
    true,
    false
  );

  const utensilio1: Utensilio = await datasource.manager.findOneBy(Utensilio, { id: 1 }) as Utensilio;
  const utensilio2: Utensilio = await datasource.manager.findOneBy(Utensilio, { id: 2 }) as Utensilio;

  quiosque.utensilios = [
    {
      utensilio: utensilio1
    } as QuiosqueUtensilio,
    {
      utensilio: utensilio2
    } as QuiosqueUtensilio
  ];

  quiosque.imagens = [
    {
      imagem: 'foo'
    } as QuiosqueImagem
  ];

  return await repository.save(quiosque);
}

describe('QuiosqueResource', () => {

  let quiosqueResource: QuiosqueResource;
  let dataSource: DataSource;
  let quiosqueRepository: QuiosqueRepository;

  beforeAll(async () => {
    dataSource = await DatabaseAccessor.getDataSource().initialize();
    await dataSource.manager.insert(Utensilio, { id: 1, nome: 'Churrasqueira' });
    await dataSource.manager.insert(Utensilio, { id: 2, nome: 'Piscina' });
  })

  beforeEach(async () => {
    await dataSource.manager.delete(Produto, {});
    quiosqueResource = DependencyContainer.getInstance().resolve(QuiosqueResource);
    quiosqueRepository = DependencyContainer.getInstance().resolve(QuiosqueRepository);
  });

  afterAll(() => dataSource.destroy());

  it('should be defined', async () => {
    expect(quiosqueResource).toBeDefined();
  });

  it('should save', async () => {

    const saved = await createSingleQuiosque(0, quiosqueRepository, dataSource);

    expect(saved.id).not.toBeNull();
    expect(saved.utensilios.length).toBe(2);
    expect(saved.imagens.length).toBe(1);
  });

  it('should return findAll', async () => {

    for (let i = 0; i < 10; i++) {
      await createSingleQuiosque(i, quiosqueRepository, dataSource);
    }

    const quiosques = await quiosqueResource.findAll(1, 5);

    expect(quiosques.content.length).toBe(5);

    expect(quiosques.content[0].nome).toBe('foo 9');
    expect(quiosques.totalPages).toBe(2);
  });

  it('should filter on findAll', async () => {

    for (let i = 0; i < 10; i++) {
      await createSingleQuiosque(i, quiosqueRepository, dataSource);
    }

    const quiosques = await quiosqueResource.findAll(1, 10, 'nome==foo 2');

    expect(quiosques.content.length).toBe(1);

    expect(quiosques.content[0].nome).toBe('foo 2');

  });

  it('should return delete', async () => {

    const saved = await createSingleQuiosque(0, quiosqueRepository, dataSource);

    await quiosqueResource.delete(saved.id);

    const quiosqueDeleted = await quiosqueResource.findById(saved.id);

    expect(quiosqueDeleted).toBeNull();

    const imagens = await dataSource.manager.findOneBy(QuiosqueImagem, { quiosque: saved });

    expect(imagens).toBeNull();

    const utensilios = await dataSource.manager.findOneBy(QuiosqueUtensilio, { quiosque: saved });

    expect(utensilios).toBeNull();

  });

  it('should return findById', async () => {

    const saved = await createSingleQuiosque(0, quiosqueRepository, dataSource);

    const quiosqueFound = await quiosqueResource.findById(saved.id) as any;

    expect(quiosqueFound).not.toBeUndefined();

  });

  it('should return findById null', async () => {

    const quiosqueFound = await quiosqueResource.findById(99999);

    expect(quiosqueFound).toBeNull();

  });

  it('should update', async () => {

    const saved = await createSingleQuiosque(0, quiosqueRepository, dataSource);

    const quiosqueUpdated = await quiosqueResource.update(saved.id, [
      { op: 'replace', path: '/nome', value: 'foo updated' },
      { op: 'replace', path: '/valorAluguel', value: 20.0 }
    ]);

    expect(quiosqueUpdated?.nome).toBe('foo updated');
    expect(quiosqueUpdated?.valorAluguel).toBe(20.0);

  });

  it('should update one to many', async () => {

    const saved = await createSingleQuiosque(0, quiosqueRepository, dataSource);

    const quiosqueUpdated = await quiosqueResource.update(saved.id, [
      { op: 'remove', path: '/utensilios/1' },
    ]);

    expect(quiosqueUpdated?.utensilios.length).toBe(1);

  });

});
