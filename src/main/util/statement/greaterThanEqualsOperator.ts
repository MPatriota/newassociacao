import { BaseOperator } from "./base.operator";

export class GreaterThanEqualsOperator extends BaseOperator {
  constructor() {
    super('>=');
  }
}
