import { DataSource } from "typeorm";
import { DatabaseAccessor } from "../../configuration/database-accessor";
import { FornecedorRepository } from "../fornecedor.repository";
import { Fornecedor } from "../../entity/fornecedor.entity";
import { Endereco } from "../../entity/endereco.entity";
import { DocumentoTipoEnum } from "../../enum/documento-tipo.enum";
import { DependencyContainer } from "../../configuration/dependency-container";
import { CondicaoPagamento } from "../../entity/condicao-pagamento.entity";
import { CondicaoPagamentoRepository } from "../condicao-pagamento.repository";

describe('FornecedorRepository', () => {

    let fornecedorRepository: FornecedorRepository;
    let condicaoPagamentoRepository: CondicaoPagamentoRepository;
    let dataSource: DataSource;

    beforeAll(async () => {
        fornecedorRepository = DependencyContainer.getInstance().resolve(FornecedorRepository);
        condicaoPagamentoRepository = DependencyContainer.getInstance().resolve(CondicaoPagamentoRepository);
        dataSource = await DatabaseAccessor.getDataSource().initialize();
    })

    beforeEach(async () => {
        await dataSource.manager.clear(Fornecedor);
    })

    it('email exists', async () => {
        const endereco = new Endereco({cep: '87000000', logradouro: 'rua teste',
            numero: '69', bairro: 'bairro teste', cidade: 'maringa',
            estado: 'pr'});

        const condicaoPagamento = new CondicaoPagamento({
          id: 1,
          nome: 'Lucas',
          parcelas: 1,
          intervalo: 2,
          vencimento: 3,
          descricao: 'descricao',
          ativa: true,
          obrigadoInformarCliente: false,
          aVista: false
        })

        await condicaoPagamentoRepository.save(condicaoPagamento);

        const id = 1;
        const email = 'fornecedor@email.com';

        const fornecedor = new Fornecedor({
            id,
            nome: 'lucas',
            endereco,
            documento: '11111111111',
            email,
            responsavel: 'Nome responsável',
            telefone: '44999999999',
            documentoTipo: DocumentoTipoEnum.CPF,
            condicaoPagamento
        });

        await fornecedorRepository.save(fornecedor);

        const existsSameId = await fornecedorRepository.emailExists(email, id);
        const existsIdNull = await fornecedorRepository.emailExists(email, undefined);

        expect(existsSameId).toBeFalsy();
        expect(existsIdNull).toBeTruthy();
    })

})
