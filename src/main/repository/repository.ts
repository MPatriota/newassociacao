import { DatabaseAccessor } from '../configuration/database-accessor';
import { ObjectLiteral, ObjectType, Repository, SelectQueryBuilder } from 'typeorm';
import { Page } from '../dto/page.dto';
import { SearchBuilder } from '../util/search-builder';
import { StatementChildSearchModel } from '../util/statement/statement-search.model';
import * as statementSearchModel from '../util/statement/statement-search.model';
import { getForceToLoadProperties } from '../annotation/force-to-load';
import { applyPatch, Operation } from "fast-json-patch/commonjs/core";

export abstract class AbstractRepository<T extends ObjectLiteral> {

  protected readonly repository: Repository<T>;

  protected constructor(private entity: ObjectType<T>) {
    this.repository = DatabaseAccessor.getDataSource().getRepository(this.entity);
  }

  async save(entity: T): Promise<T> {
    return await this.repository.save(entity);
  }

  async saveAll(entities: T[]): Promise<T[]> {
    return await this.repository.save(entities);
  }

  async findById(id: number | string): Promise<T | null> {
    return await this.repository.findOne({
      where: { id } as any,
      withDeleted: true
    });
  }

  async findAllUnlimited() {
    return this.repository.find();
  }

  async findAll(options: {
    search: statementSearchModel.StatementSearchModel | undefined | string,
    limit: number;
    page: number
  }): Promise<Page<T>> {

    const queryBuilder = this.repository.createQueryBuilder('entity');

    const forceLoadProperties = getForceToLoadProperties(this.repository.target as new () => T);
    const uniqueDependencies = [...new Set(forceLoadProperties)];
    const joinTracker = new Map<string, string>();

    if (uniqueDependencies.length > 0) {
      uniqueDependencies.forEach(dependency => {

        const propertyPath = `${dependency.parentAlias}.${dependency.property}`;
        const alias = `${dependency.property}_${dependency.parentAlias}`;

        joinTracker.set(propertyPath, alias);

        queryBuilder.leftJoinAndSelect(propertyPath, alias).withDeleted();

      });
    }

    if (options.search && typeof options.search !== 'string') {

      const searchStatement = options.search;

      if (searchStatement.statement) {

        const statement = SearchBuilder.getStatement(searchStatement.statement, 'entity');

        queryBuilder.where(statement.statement, statement.param);

      }

      if (searchStatement.children) {

        this.applyDependencySearches(searchStatement.children, queryBuilder, joinTracker);

      }

    }

    if (options.search && typeof options.search === 'string' && options.search.trim() != '') {
      const statement = SearchBuilder.getStatement(options.search, 'entity');
      queryBuilder.where(statement.statement, statement.param);
    }

    const total = await queryBuilder.getCount();

    const items = await queryBuilder
      .skip((options.page - 1) * options.limit)
      .take(options.limit)
      .getMany();

    return {
      content: items,
      number: options.page,
      size: options.limit,
      totalElements: total,
      totalPages: Math.ceil(total / options.limit)
    } as Page<T>;
  }

  private applyDependencySearches(children: StatementChildSearchModel[], queryBuilder: SelectQueryBuilder<T>, joinTracker: Map<string, string>) {

    for (const child of children) {

      const joinPath = `entity.${child.alias}`;

      if (!joinTracker.has(joinPath)) {
        queryBuilder.leftJoinAndSelect(joinPath, child.alias);
        joinTracker.set(joinPath, `${child.alias}_entity`);
      }

      const statement = SearchBuilder.getStatement(child.statement, joinTracker.get(joinPath));
      queryBuilder.andWhere(statement.statement, statement.param);

      if (child.children) {
        this.applyDependencySearches(child.children, queryBuilder, joinTracker);
      }

    }

  }

  async delete(id: number | string): Promise<void> {
    const foundEntity = await this.findById(id);

    if(foundEntity) {
      await this.repository.remove(foundEntity);
    }
  }

  async update(id: number, partials: Operation[]) {

    const modifiedPartials = partials.map(operation => {
      if (operation.op === 'remove') {
        return {
          op: 'replace',
          path: operation.path,
          value: null
        };
      }
      return operation;
    }) as any;

    const entity = await this.findById(id);

    const editedEntity = applyPatch(entity, modifiedPartials).newDocument;

    if (editedEntity) {
      return this.save(editedEntity);
    }

    return null;
  }

}
