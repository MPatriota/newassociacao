import { IpcMethod } from '../annotation/ipc-method';
import { IpcClass } from '../annotation/ipc-class';
import { TagRepository } from '../repository/tag.repository';
import { Tag } from '../entity/tag.entity';
import { Page } from '../dto/page.dto';
import { applyPatch, Operation } from 'fast-json-patch/commonjs/core';

@IpcClass("tag")
export class TagResource {

  constructor(private readonly tagRepository: TagRepository) {
  }

  @IpcMethod('update')
  async update(id: number, partials: Operation[]): Promise<Tag | null> {
    const tag = await this.tagRepository.findById(id);
    const editedTag = applyPatch(tag, partials).newDocument;
    if (editedTag) {
      await this.tagRepository.restore(id);
      return this.tagRepository.save(editedTag);
    }
    return null;
  }

  @IpcMethod('save')
  async save(tag: { id?: number, name: string, color: string }): Promise<Tag | null> {
    return this.tagRepository.save(new Tag({ name: tag.name, color: tag.color }));
  }

  @IpcMethod('findAll')
  async findAll(page: number,
                limit: number,
                search?: string): Promise<Page<Tag>> {

    return await this.tagRepository.findAll({
      search: search,
      limit,
      page
    });

  }

  @IpcMethod('delete')
  async delete(id: number): Promise<void> {
    return this.tagRepository.delete(id);
  }

  @IpcMethod('findById')
  async findById(id: number): Promise<Tag | null> {
    return this.tagRepository.findById(id);
  }

  @IpcMethod('findBySlug')
  async findBySlug(slug: string): Promise<Tag | null> {
    return this.tagRepository.findBySlug(slug);
  }

  @IpcMethod('findTagsFromCantina')
  async findTagsFromCantina() {
    return await this.tagRepository.findTagsFromCantina();
  }

}
