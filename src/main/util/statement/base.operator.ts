export interface IOperator {
  convert(value: string): string;
  formatPlaceholder(paramName: string, value: any): string;
  formatValue(value: string): any;
}

export abstract class BaseOperator implements IOperator {

  protected constructor(
    protected sqlOperator: string
  ) {
  }

  convert(value: string): string {
    return this.sqlOperator;
  }

  formatPlaceholder(paramName: string, value: any): string {
    return `:${paramName}`;
  }

  formatValue(value: string): any {
    return value;
  }

}

