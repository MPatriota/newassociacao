import { BaseOperator } from "./base.operator";

export class InOperator extends BaseOperator {
  constructor() {
    super('in');
  }

  override formatPlaceholder(paramName: string, value: any): string {
    const values = this.formatValue(value);
    const placeholders = values.map((_, index) => `:${paramName}_${index}`).join(', ');
    return `(${placeholders})`;
  }

  override formatValue(value: string): string[] {
    const match = value.match(/\((.*?)\)/);
    if (match) {
      return match[1].split(',').map(v => v.trim());
    }
    return [value.trim()];
  }
}
