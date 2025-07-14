import { Produto } from "../../entity/produto.entity";
import { TipoProduto } from "../../entity/enums/tipo-produto";
import { UnidadeMedida } from "../../entity/unidade.medida.entity";
import { SaidaEstoque } from "../../entity/saida-estoque.entity";
import { SaidaEstoqueService } from "../saida-estoque.service";

describe('SaidaEstoqueService', () => {

    let saidaEstoqueRepository: any;
    let saidaEstoqueService: SaidaEstoqueService;
    let produtoService: any;
    let produto: Produto;
    let saidaEstoque: SaidaEstoque;
    let notificationService: any;
    let usuarioService: any;

    beforeEach(() => {
        produto = new Produto({
            nome: 'produto',
            valor: 10.0,
            custo: 5.0,
            tipo: TipoProduto.CANTINA,
            estoque: 10,
            estoqueMinimo: 5,
            tags: [],
            unidadeMedida: new UnidadeMedida({ nome: 'Kilograma ', sigla: 'kg' }),
            imagem: 'teste'
        });

        saidaEstoque = {
            id: 1,
            produto,
            quantidade: 3,
            observacao: 'observação',
            requisitante: 'requisitante',
            dataCadastro: new Date(),
        }

        saidaEstoqueRepository = {
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findById: jest.fn()
        }

        produtoService = {
          attEstoque: jest.fn(() => Promise.resolve(produto))
        }

        notificationService = {
          add: jest.fn()
        }

        usuarioService = {
          findUsuarioByContext: jest.fn(() => Promise.resolve({nome: 'teste'}))
        }

        saidaEstoqueService = new SaidaEstoqueService(saidaEstoqueRepository, produtoService, notificationService, usuarioService);
    })

    it('should att produto estoque when save saida estoque', () => {
        saidaEstoqueService.save(saidaEstoque);

        expect(produtoService.attEstoque).toHaveBeenCalledWith(produto, -3);
    })

    it('should att produto estoque when update saida estoque', async () => {
        saidaEstoqueRepository.findById = jest.fn(() => ({...saidaEstoque, quantidade: 4}))
        saidaEstoqueRepository.update = jest.fn(() => saidaEstoque)

        await saidaEstoqueService.update(1, []);

        expect(produtoService.attEstoque).toHaveBeenCalledWith(produto, 1);
    })

    it('should att produto estoque when delete saida estoque', async () => {
        saidaEstoqueRepository.findById = jest.fn(() => saidaEstoque)

        await saidaEstoqueService.delete(1);

        expect(produtoService.attEstoque).toHaveBeenCalledWith(produto, 3);
    })

});
