import { DataSource } from 'typeorm';
import { Logger } from '../service/logger.service';
import path from 'path';
import { Store } from '../electron/store';
import { AudSubscriber } from './aud-listener';
import fs from 'fs';

export class DatabaseAccessor {

  private static INSTANCE: DatabaseAccessor | null = null;
  private logger: Logger = Logger.getLoggerByClass(this);

  private constructor(private dataSource: DataSource) {
    this.dataSource = dataSource;
  }

  public static getInstance() {

    if (this.INSTANCE == null) {
      this.INSTANCE = new DatabaseAccessor(this.getDataSourceByEnvironment());
      this.INSTANCE.logger.debug(this.INSTANCE.getConnectionString());
    }

    return this.INSTANCE;
  }

  public static getDataSource() {
    const databaseAccessor = this.getInstance();
    return databaseAccessor.dataSource;
  }

  private static getDataSourceByEnvironment() {

    if (Store.instance.get("NODE_ENV") == 'test') {
      return new DataSource({
        type: "sqlite",
        database: ":memory:",
        dropSchema: true,
        entities: [path.join(path.join(__dirname, '..'), 'entity', '*.entity.{ts,js}')],
        synchronize: true
      });
    }

    const environmentDir = path.join(process.cwd(), 'environment');
    if(!fs.existsSync(environmentDir)) {
      fs.mkdirSync(environmentDir);
    }

    const environmentFile = path.join(environmentDir, 'environment.json');

    if(!fs.existsSync(environmentFile)) {
      const baseEnvironmentData = {
        POSTGRES_USER: "postgres",
        POSTGRES_PASSWORD: "postgres",
        POSTGRES_HOST: "localhost",
        POSTGRES_PORT: 5432,
        POSTGRES_DB: "association"
      }

      fs.appendFileSync(environmentFile, JSON.stringify(baseEnvironmentData));
    }

    const environmentData = JSON.parse(fs.readFileSync(environmentFile, 'utf8'));

    return new DataSource({
      type: 'postgres',
      host: environmentData['POSTGRES_HOST'],
      port: environmentData['POSTGRES_PORT'],
      username: environmentData['POSTGRES_USER'],
      password: environmentData['POSTGRES_PASSWORD'],
      database:environmentData['POSTGRES_DB'],
      entities: [path.join(path.join(__dirname, '..'), 'entity', '*.entity.{ts,js}')],
      connectTimeoutMS: 10000,
      synchronize: true,
      logging: ['query'],
      subscribers: [AudSubscriber]
    });
  }

  public getConnectionString(): string {
    return this.formatConnectionString();
  }

  private formatConnectionString(): string {
    return `postgres://${Store.instance.get('POSTGRES_HOST')}:${Store.instance.get('POSTGRES_PORT')}/${Store.instance.get('POSTGRES_DB')}`;
  }

}
