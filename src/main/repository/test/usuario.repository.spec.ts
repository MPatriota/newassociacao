import { DataSource } from "typeorm";
import { DatabaseAccessor } from "../../configuration/database-accessor";
import { DependencyContainer } from "../../configuration/dependency-container";
import { UsuarioRepository } from '../usuario.repository';
import { Usuario } from '../../entity/usuario.entity';

describe('UsuarioRepository', () => {

    let usuarioRepository: UsuarioRepository;
    let dataSource: DataSource;

    beforeAll(async () => {
        usuarioRepository = DependencyContainer.getInstance().resolve(UsuarioRepository);
        dataSource = await DatabaseAccessor.getDataSource().initialize();
    })

    beforeEach(async () => {
        await dataSource.manager.clear(Usuario);
    })

    it('should find by usuario and senha', async () => {
      await dataSource.manager.save(Usuario, {id: 1, nome: 'lucas', usuario: 'usuario', senha: 'teste'});

      const usuario = await usuarioRepository.findByUsuarioAndSenha("usuario", "teste");

      expect(usuario?.id).toEqual(1);
    })

})
