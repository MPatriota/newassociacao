import { Usuario } from '../entity/usuario.entity';
import { Injectable } from '../annotation/injectable';
import { AbstractRepository } from './repository';

@Injectable()
export class UsuarioRepository extends AbstractRepository<Usuario> {

  constructor() {
    super(Usuario);
  }

  public findByUsuarioAndSenha(usuario: string, senha?: string) {
    return this.repository.createQueryBuilder()
      .where('usuario = :usuario', {usuario})
      .andWhere("senha = :senha", {senha})
      .getOne();
  }

}
