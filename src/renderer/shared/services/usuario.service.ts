import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { from, Observable } from 'rxjs';
import { Page } from '../model/page.model';
import { Operation } from "fast-json-patch/commonjs/core";
import { Usuario } from '../model/usuario.model';
import { BaseService } from './base-service';

@Injectable()
export class UsuarioService extends BaseService {

  constructor(
    private electronService: ElectronService
  ) {
    super();
  }

  public save(usuario: Usuario) {
    return this.from(this.electronService.ipcRenderer.invoke('usuario:save', usuario));
  }

  public findAll(page = 1, limit = 10, search?: string): Observable<Page<Usuario>> {
    return this.from(this.electronService.ipcRenderer.invoke('usuario:findAll', page, limit, search));
  }

  public delete(id: number) {
    return this.from(this.electronService.ipcRenderer.invoke('usuario:delete', id));
  }

  public findById(id: number): Observable<Usuario> {
    return this.from(this.electronService.ipcRenderer.invoke('usuario:findById', id));
  }

  public update(id: number, operations: Operation[]): Observable<Usuario> {
    return this.from(this.electronService.ipcRenderer.invoke('usuario:update', id, operations));
  }

  public findByUsuarioAndSenha(usuario: string, senha: string): Observable<Usuario> {
    return this.from(this.electronService.ipcRenderer.invoke('usuario:findByUsuarioAndSenha', usuario, senha));
  }

  public redefinirSenha(usuarioId: number, senha: string): Observable<void> {
    return this.from(this.electronService.ipcRenderer.invoke('usuario:redefinirSenha', usuarioId, senha));
  }

  public login(usuarioId: number): Observable<void> {
    return this.from(this.electronService.ipcRenderer.invoke('usuario:login', usuarioId));
  }

}
