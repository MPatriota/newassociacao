import { OperatorRegistry } from './statement/operator.registry';

export class SearchBuilder {
  private static readonly CONDITION: { [key: string]: string } = {
    ',': 'and',
    ';': 'or'
  };

  public static getStatement(search: string, alias?: string): { statement: string, param: any } {

    if (!search) {
      return { statement: '', param: {} };
    }

    const protectedSearch = this.protectParenthesesContent(search);

    const conditions = protectedSearch.match(/[,;]/g) || [];

    const fieldCount: { [key: string]: number } = {};

    const parts = protectedSearch.split(/[,;]/).map(searchPart => {

      const originalPart = this.restoreParenthesesContent(searchPart);

      return this.buildSearchPart(originalPart, alias, fieldCount);

    });

    return {
      statement: this.joinParts(parts, conditions),
      param: this.mergeParams(parts)
    };

  }

  private static buildSearchPart(searchPart: string, alias?: string, fieldCount: { [key: string]: number } = {}): any {

    const { field, operator, value } = this.parsePart(searchPart);

    if (!field || !operator || !value) {
      throw new Error(`Invalid search part: ${searchPart}`);
    }

    fieldCount[field] = (fieldCount[field] || 0) + 1;

    const paramName = this.generateParamName(field, fieldCount[field]);

    const operatorInstance = OperatorRegistry.getInstance().getOperator(operator);

    if (!operatorInstance) {
      throw new Error(`Unknown operator: ${operator}`);
    }

    const paramPlaceholder = operatorInstance.formatPlaceholder(paramName, value);

    const formattedValue = operatorInstance.formatValue(value);

    const statement = `${alias ? alias + '.' : ''}${field} ${operatorInstance.convert(value)} ${paramPlaceholder}`;

    return {
      statement,
      param: this.createParam(paramName, formattedValue)
    };
  }

  private static parsePart(searchPart: string): { field: string, operator: string, value: string } {

    const operators = Array.from(OperatorRegistry.getInstance().getOperatorSymbols())
      .sort((a, b) => b.length - a.length);

    for (const operator of operators) {

      if (searchPart.includes(operator)) {

        const [field, value] = searchPart.split(operator);

        if (field && value) {

          return {
            field: field.trim(),
            operator,
            value: value.trim()
          };

        }

      }

    }

    throw new Error(`No valid operator found in: ${searchPart}`);
  }

  private static generateParamName(field: string, count: number): string {
    return count > 1 ? `${field}_${count}` : field;
  }

  private static createParam(paramName: string, value: any): any {

    if (Array.isArray(value)) {

      return value.reduce((acc, curr, index) => ({
        ...acc,
        [`${paramName}_${index}`]: curr
      }), {});

    }

    return { [paramName]: value };
  }

  private static joinParts(parts: any[], conditions: string[]): string {

    return parts.reduce((acc, curr, index) => {
      if (index === 0) return curr.statement;
      const condition = this.CONDITION[conditions[index - 1]];
      return `${acc} ${condition} ${curr.statement}`;
    }, '');
  }

  private static mergeParams(parts: any[]): any {
    return parts.reduce((acc, curr) => ({
      ...acc,
      ...curr.param
    }), {});
  }

  private static protectParenthesesContent(search: string): string {
    let result = search;
    const parenthesesMatches = search.match(/\(.*?\)/g) || [];

    for (const match of parenthesesMatches) {
      const protectedField = match.replace(/,/g, '|');
      result = result.replace(match, protectedField);
    }

    return result;
  }

  private static restoreParenthesesContent(search: string): string {
    return search.replace(/\|/g, ',');
  }

}
