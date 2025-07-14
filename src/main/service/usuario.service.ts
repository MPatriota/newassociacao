import { Injectable } from "../annotation/injectable";
import { UsuarioRepository } from '../repository/usuario.repository';
import { Usuario } from '../entity/usuario.entity';
import { UsuarioContext } from '../context/UsuarioContext';

@Injectable()
export class UsuarioService {

  constructor(
    private usuarioRepository: UsuarioRepository,
  ) {}

  public save(usuario: Usuario) {
    return this.usuarioRepository.save(usuario);
  }

  public async redefinirSenha(usuarioId: number, senha: string) {
    const foundUsuario = await this.usuarioRepository.findById(usuarioId);

    if (!foundUsuario) {
      throw new Error('Usuário não encontrado');
    }

    if(senha === foundUsuario.senha) {
      throw new Error('A nova senha não pode ser igual a senha atual');
    }

    foundUsuario.senha = senha;
    foundUsuario.primeiroAcessoRealizado = true;

    UsuarioContext.instance.id = usuarioId;

    await this.usuarioRepository.save(foundUsuario);
  }

  public async findUsuarioByContext() {
    if(!UsuarioContext.instance.id) {
      throw new Error('Usuário não encontrado no contexto');
    }

    const usuario = await this.usuarioRepository.findById(UsuarioContext.instance.id);

    if(!usuario) {
      throw new Error('Usuário não encontrado no contexto');
    }

    return usuario;
  }

  public async findAll() {
    return await this.usuarioRepository.findAllUnlimited();
  }

}
