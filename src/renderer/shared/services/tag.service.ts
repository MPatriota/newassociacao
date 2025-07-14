import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { from, Observable } from 'rxjs';
import { Page } from '../model/page.model';
import { Tag } from '../model/tag.model';
import { Operation } from 'fast-json-patch/commonjs/core';
import { BaseService } from './base-service';

@Injectable()
export class TagService extends BaseService {

  constructor(
    private electronService: ElectronService
  ) {
    super();
  }

  public save(tag: { id?: number, name: string, color: string }): Observable<Tag> {
    return this.from(this.electronService.ipcRenderer.invoke('tag:save', tag));
  }

  public update(id: number, partials: Operation[]): Observable<Tag> {
    return this.from(this.electronService.ipcRenderer.invoke('tag:update', id, partials));
  }

  public findAll(page: number = 1,
                 limit: number = 10,
                 search?: string | null): Observable<Page<Tag>> {

    return this.from(this.electronService.ipcRenderer.invoke('tag:findAll', page, limit, search));
  }

  public delete(id: number): Observable<void> {
    return this.from(this.electronService.ipcRenderer.invoke('tag:delete', id));
  }

  public findBySlug(slug: string): Observable<Tag> {
    return this.from(this.electronService.ipcRenderer.invoke('tag:findBySlug', slug));
  }

  public findTagsFromCantina(): Observable<Tag[]> {
    return this.from(this.electronService.ipcRenderer.invoke('tag:findTagsFromCantina'));
  }


}
