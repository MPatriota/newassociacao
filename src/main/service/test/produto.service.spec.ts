import { ProdutoService } from "../produto.service";
import { Produto } from "../../entity/produto.entity";
import { TipoProduto } from "../../entity/enums/tipo-produto";
import { UnidadeMedida } from "../../entity/unidade.medida.entity";

describe('ProdutoService', () => {

    let produtoRepository: any;
    let produtoService: ProdutoService;
    let produto: Produto;

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

        produtoRepository = {
            save: jest.fn()
        }

        produtoService = new ProdutoService(produtoRepository);
    })

    it('should att estoque', () => {
        produtoService.attEstoque(produto, 5);

        expect(produtoRepository.save).toHaveBeenCalledWith({
            ...produto,
            estoque: 15
        })
    })

    it('should not att estoque insuficiente', () => {
        expect(async () => produtoService.attEstoque(produto, -11)).rejects.toThrow();

        expect(produtoRepository.save).not.toHaveBeenCalled();
    })

});