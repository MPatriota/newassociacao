import { Usuario } from '../entity/usuario.entity';
import { IpcMethod } from '../annotation/ipc-method';
import { IpcClass } from '../annotation/ipc-class';
import { UsuarioRepository } from "../repository/usuario.repository";
import { applyPatch, Operation } from "fast-json-patch/commonjs/core";
import { UsuarioService } from '../service/usuario.service';
import { UsuarioContext } from '../context/UsuarioContext';

@IpcClass("usuario")
export class UsuarioResource {

  constructor(
    private readonly usuarioRepository: UsuarioRepository,
    private readonly usuarioService: UsuarioService,
  ) {}

  @IpcMethod('save')
  async save(usuario: Usuario) {
    return this.usuarioService.save(usuario);
  }

  @IpcMethod('findById')
  async findById(id: number) {
    return this.usuarioRepository.findById(id);
  }

  @IpcMethod('findAll')
  async findAll(page: number, limit: number, search?: string) {

    return await this.usuarioRepository.findAll({
      search,
      limit,
      page
    });

  }

  @IpcMethod('delete')
  async delete(id: number) {
    return this.usuarioRepository.delete(id);
  }

  @IpcMethod('update')
  async update(id: number, partials: Operation[]) {
    return this.usuarioRepository.update(id, partials);
  }

  @IpcMethod('findByUsuarioAndSenha')
  async findByUsuarioAndSenha(usuario: string, senha: string) {
    return this.usuarioRepository.findByUsuarioAndSenha(usuario, senha);
  }

  @IpcMethod('redefinirSenha')
  async redefinirSenha(usuarioId: number, senha: string) {
    return this.usuarioService.redefinirSenha(usuarioId, senha);
  }

  @IpcMethod('login')
  login(usuarioId: number) {
    UsuarioContext.instance.id = usuarioId;
    UsuarioContext.instance.authenticate();
  }

}
