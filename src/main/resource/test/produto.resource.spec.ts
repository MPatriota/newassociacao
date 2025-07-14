import { DataSource } from 'typeorm';
import { DatabaseAccessor } from '../../configuration/database-accessor';
import { DependencyContainer } from '../../configuration/dependency-container';
import { ProdutoResource } from '../produto.resource';
import { Produto } from '../../entity/produto.entity';
import { TipoProduto } from '../../entity/enums/tipo-produto';
import { UnidadeMedida } from '../../entity/unidade.medida.entity';
import { Tag } from '../../entity/tag.entity';
import { ProdutoTag } from '../../entity/produto-tag.entity';
import { TagRepository } from '../../repository/tag.repository';

async function createSingleProduto(index: number, tagRepository: TagRepository, produtoResource: ProdutoResource, dataSource: DataSource) {

  const produto = new Produto({
    nome: 'produto' + index,
    valor: 10.0,
    custo: 5.0,
    tipo: TipoProduto.CANTINA,
    estoque: 10,
    estoqueMinimo: 5,
    tags: [] as ProdutoTag[],
    unidadeMedida: new UnidadeMedida({ nome: 'Kilograma ' + index, sigla: 'kg' }),
    imagem: 'teste'
  });

  const tag = await tagRepository.findById(1) as any;

  const tag2 = await tagRepository.findById(2) as any;

  const saved = await produtoResource.save(produto);

  await dataSource.getRepository(ProdutoTag).save(new ProdutoTag({ tag: tag, produto: produto }));
  await dataSource.getRepository(ProdutoTag).save(new ProdutoTag({ tag: tag2, produto: produto }));

  return saved;
}

async function createProdutos(tagRepository: TagRepository, produtoResource: ProdutoResource, datasource: DataSource) {
  for (let index = 0; index < 10; index++) {
    await createSingleProduto(index, tagRepository, produtoResource, datasource);
  }
}

describe('ProdutoResource', () => {

  let produtoResource: ProdutoResource;
  let dataSource: DataSource;
  let tagRepository: TagRepository;

  beforeAll(async () => {
    dataSource = await DatabaseAccessor.getDataSource().initialize();
    await dataSource.manager.insert(Tag, { id: 1, name: 'tag1', color: '#fffff', slug: 'tag1' });
    await dataSource.manager.insert(Tag, { id: 2, name: 'tag2', color: '#fffff', slug: 'tag2' });
  })

  beforeEach(async () => {
    await dataSource.manager.delete(Produto, {});
    produtoResource = DependencyContainer.getInstance().resolve(ProdutoResource);
    tagRepository = DependencyContainer.getInstance().resolve(TagRepository);
  });

  afterAll(() => dataSource.destroy());

  it('should be defined', async () => {
    expect(produtoResource).toBeDefined();
  });

  it('should save', async () => {
    const produtoSaved = await createSingleProduto(0, tagRepository, produtoResource, dataSource);

    expect(produtoSaved.id).not.toBeNull();

    const unidadeMedidaLoaded = produtoSaved.unidadeMedida;

    expect(unidadeMedidaLoaded).not.toBeNull();
  });

  it('should return findAll', async () => {

    await createProdutos(tagRepository, produtoResource, dataSource);

    const produtos = await produtoResource.findAll(1, 5);

    expect(produtos.content.length).toBe(5);

    expect(produtos.content[0].nome).toBe('produto9');
    expect(produtos.content[0].tags.length).toBe(2);

    expect(produtos.totalPages).toBe(2);

  });

  it('should filter on findAll', async () => {

    await createProdutos(tagRepository, produtoResource, dataSource);

    const produtos = await produtoResource.findAll(1, 10, 'nome==produto1');

    expect(produtos.content.length).toBe(1);

    expect(produtos.content[0].nome).toBe('produto1');

  });

  it('should filter on findAll with OR', async () => {

    await createProdutos(tagRepository, produtoResource, dataSource);

    const produtos = await produtoResource.findAll(1, 10, 'nome==produto1;nome==produto2');

    expect(produtos.content.length).toBe(2);

    expect(produtos.content[0].nome).toBe('produto2');

    expect(produtos.content[1].nome).toBe('produto1');

  });

  it('should filter on findAll with IN', async () => {

    await createProdutos(tagRepository, produtoResource, dataSource);

    const produtos = await produtoResource.findAll(1, 10, 'nome=in=(produto1,produto2)');

    expect(produtos.content.length).toBe(2);

    expect(produtos.content[0].nome).toBe('produto2');

    expect(produtos.content[1].nome).toBe('produto1');

  });

  it('should filter on findAll with one to many filter', async () => {

    await createProdutos(tagRepository, produtoResource, dataSource);

    const produtos = await produtoResource.findAll(1, 10, {
      statement: 'nome==produto0',
      children: [
        {
          statement: 'tag.id=in=(1)',
          alias: 'tags'
        }
      ]
    });

    expect(produtos.content.length).toBe(1);

  });


  it('should return delete', async () => {

    const produto = await createSingleProduto(0, tagRepository, produtoResource, dataSource);

    await produtoResource.delete(produto.id);

    const produtoDeleted = await produtoResource.findById(produto.id);

    expect(produtoDeleted).toBeNull();

  });

  it('should return findById', async () => {

    const produto = await createSingleProduto(0, tagRepository, produtoResource, dataSource);

    const saved = await produtoResource.findById(produto.id) as any;

    expect(saved).not.toBeUndefined();

  });

  it('should return findById null', async () => {

    const produtoFound = await produtoResource.findById(1);

    expect(produtoFound).toBeNull();

  });

  it('should update', async () => {

    const produto = await createSingleProduto(0, tagRepository, produtoResource, dataSource);

    const produtoUpdated = await produtoResource.update(produto.id, [
      { op: 'replace', path: '/nome', value: 'produto updated' },
      { op: 'replace', path: '/valor', value: 20.0 }
    ]);

    expect(produtoUpdated?.nome).toBe('produto updated');

    expect(produtoUpdated?.valor).toBe(20.0);

  });

  it('should update one to many', async () => {

    const produto = await createSingleProduto(0, tagRepository, produtoResource, dataSource);

    const produtoUpdated = await produtoResource.update(produto.id, [
      { op: 'remove', path: '/tags/1' },
    ]);

    expect(produtoUpdated?.tags.length).toBe(1);

  });

});
