// @ts-ignore
import { ColumnType } from 'typeorm/driver/types/ColumnTypes';

export const getColumnType = (postgresType: ColumnType, sqliteType: ColumnType) => {

  if (process.env['NODE_ENV'] === 'test') {
    return sqliteType;
  }

  return postgresType;
}

export class ColumnNumericTransformer {
  to(data: number): number {
    return data;
  }

  from(data: string): number {
    return parseFloat(data);
  }
}
