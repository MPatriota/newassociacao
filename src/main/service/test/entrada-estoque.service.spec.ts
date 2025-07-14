import { Produto } from "../../entity/produto.entity";
import { TipoProduto } from "../../entity/enums/tipo-produto";
import { UnidadeMedida } from "../../entity/unidade.medida.entity";
import { EntradaEstoque } from "../../entity/entrada-estoque.entity";
import { EntradaEstoqueTipoEnum } from "../../enum/entrada-estoque-tipo.enum";
import { EntradaEstoqueService } from "../entrada-estoque.service";
import {NotificationService} from '../notification.service';
import {UsuarioService} from '../usuario.service';

describe('EntradaEstoqueService', () => {

    let entradaEstoqueRepository: any;
    let entradaEstoqueService: EntradaEstoqueService;
    let produtoService: any;
    let notificationService: any;
    let usuarioService: any;
    let produto: Produto;
    let entradaEstoque: EntradaEstoque;

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

        entradaEstoque = {
            id: 1,
            produto,
            quantidade: 3,
            valor: 10,
            subtotal: 30,
            observacao: 'observação',
            tipo: EntradaEstoqueTipoEnum.SEM_FORNECEDOR,
            requisitante: 'requisitante',
            dataCadastro: new Date(),
            contasPagar: []
        }

        entradaEstoqueRepository = {
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

        entradaEstoqueService = new EntradaEstoqueService(entradaEstoqueRepository, produtoService, notificationService, usuarioService);
    })

    it('should att produto estoque when save entrada estoque', () => {
        entradaEstoqueService.save(entradaEstoque);

        expect(produtoService.attEstoque).toHaveBeenCalledWith(produto, 3);
    })

    it('should att produto estoque when update entrada estoque', async () => {
        entradaEstoqueRepository.findById = jest.fn(() => ({...entradaEstoque, quantidade: 4}))
        entradaEstoqueRepository.update = jest.fn(() => entradaEstoque)

        await entradaEstoqueService.update(1, []);

        expect(produtoService.attEstoque).toHaveBeenCalledWith(produto, -1);
    })

    it('should att produto estoque when delete entrada estoque', async () => {
        entradaEstoqueRepository.findById = jest.fn(() => entradaEstoque)

        await entradaEstoqueService.delete(1);

        expect(produtoService.attEstoque).toHaveBeenCalledWith(produto, -3);
    })

});
