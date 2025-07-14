import { DatabaseAccessor } from './database-accessor';
import { DataSource, EntityMetadata, QueryRunner, Table, TableColumn, TableColumnOptions } from 'typeorm';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata.js';

export class AudCreator {
  private dataSource: DataSource;
  private queryRunner: QueryRunner;

  constructor() {
    this.dataSource = DatabaseAccessor.getDataSource();
    this.queryRunner = this.dataSource.createQueryRunner();
  }

  public async createAud() {
    await this.initializeQueryRunner();

    try {
      await this.configureTables();
      await this.queryRunner.commitTransaction();
    } catch (err) {
      await this.queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await this.queryRunner.release();
    }

  }

  private async initializeQueryRunner() {
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();
  }

  private async configureTables() {
    let entityMetadatas = this.dataSource.entityMetadatas;

    for (let entityMetadata of entityMetadatas) {
      await this.configureTable(entityMetadata);
    }
  }

  private async configureTable(entityMetadata: EntityMetadata) {
    const audTableName = entityMetadata.tableName + "_aud";

    const audTable = await this.queryRunner.getTable(audTableName);

    if(audTable) {
      await this.updateAudTable(entityMetadata, audTable);
    } else {
      await this.createAudTable(entityMetadata, audTableName);
    }
  }

  private async updateAudTable(entityMetadata: EntityMetadata, audTable: Table) {
    await this.addAudColumns(entityMetadata, audTable);
  }

  private async addAudColumns(entityMetadata: EntityMetadata, audTable: Table) {
    const columnsToAdd: TableColumn[] = [];

    for (const column of entityMetadata.columns) {
      const existingAudColumn = audTable.findColumnByName(column.databaseName);

      if(!existingAudColumn) {
        columnsToAdd.push(new TableColumn(this.createAudColumn(column)));
      }
    }

    if(columnsToAdd.length) {
      await this.queryRunner.addColumns(audTable, columnsToAdd);
    }
  }

  private async createAudTable(entityMetadata: EntityMetadata, audTableName: string) {
    await this.queryRunner.createTable(new Table({
      name: audTableName,
      columns: this.createAudColumns(entityMetadata)
    }))
  }

  private createAudColumns(entityMetadata: EntityMetadata) {
    const audColumns = entityMetadata.columns.map(column => this.createAudColumn(column));
    audColumns.push(this.createPrimaryColumn());
    audColumns.push(this.createRevTypeColumn());
    audColumns.push(this.createUserColumn());
    audColumns.push(this.createRevDateColumn());

    return audColumns;
  }

  private createAudColumn(entityColumn: ColumnMetadata): TableColumnOptions {
    return {
      name: entityColumn.databaseName,
      type: this.defineColumnType(entityColumn),
      isPrimary: entityColumn.isPrimary,
      isNullable: !entityColumn.isPrimary
    }
  }

  private defineColumnType(entityColumn: ColumnMetadata) {
    if (typeof entityColumn.type == 'function') {
      let result = entityColumn.type();

      switch (typeof result) {
        case "string":
          return 'varchar'
        case "number":
          return 'int'
        case "boolean":
          return 'boolean'
      }

    }

    return entityColumn.type;
  }

  private createPrimaryColumn(): TableColumnOptions {
    return {
      name: 'rev',
      type: 'int',
      isPrimary: true,
      isGenerated: true,
      generationStrategy: 'increment'
    }
  }

  private createRevTypeColumn(): TableColumnOptions {
    return {
      name: 'rev_type',
      type: 'int',
    }
  }

  private createUserColumn(): TableColumnOptions {
    return {
      name: 'user_id',
      type: 'int',
    }
  }

  private createRevDateColumn(): TableColumnOptions {
    return {
      name: 'rev_date',
      type: 'timestamp',
      default: 'now()'
    }
  }

}
