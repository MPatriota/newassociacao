import { DataSource } from 'typeorm';
import { ClienteResource } from '../cliente.resource';
import { DependencyContainer } from '../../configuration/dependency-container';
import { DatabaseAccessor } from '../../configuration/database-accessor';
import { Cliente } from '../../entity/cliente.entity';
import { Endereco } from '../../entity/endereco.entity';
import * as fs from "fs";
import * as path from "path";
import { Dependente } from '../../entity/dependente.entity';

describe('ClienteResource', () => {

    let clienteResource: ClienteResource;
    let dataSource: DataSource;

    beforeAll(async () => {
        dataSource = await DatabaseAccessor.getDataSource().initialize();
        clienteResource = DependencyContainer.getInstance().resolve(ClienteResource);
    })

    it('should save cliente', async () => {
        const endereco = new Endereco({cep: '87000000', logradouro: 'rua teste',
            numero: '69', bairro: 'bairro teste', cidade: 'maringa',
            estado: 'pr'});

        const cliente = new Cliente({nome: 'Lucas Vinícius', endereco,
            matricula: '123456', foto: 'foto',
            limiteCompra: 153.44, dependentes: [], email: 'cliente@email.com'});

        const dependente = new Dependente({nome: 'dependente'});
        
        cliente.dependentes.push(dependente);
        
        await clienteResource.save(cliente);

        const savedCliente = await clienteResource.findById(1);
        expect(savedCliente).toEqual(cliente);
        expect(savedCliente?.endereco.id).toEqual(1);
        expect(savedCliente?.dependentes[0].id).toEqual(1);
    })

    it('should update cliente', async () => {
        const updatedNome = 'updated nome';

        const clienteToUpdate = await clienteResource.findById(1);
        expect(clienteToUpdate?.nome).not.toBe(updatedNome);

        clienteToUpdate!.nome = updatedNome;

        await clienteResource.save(clienteToUpdate!);

        const updatedCliente = await clienteResource.findById(1);

        expect(updatedCliente?.nome).toBe(updatedNome);
    })



})
