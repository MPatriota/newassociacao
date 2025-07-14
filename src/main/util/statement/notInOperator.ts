import { InOperator } from "./inOperator";

export class NotInOperator extends InOperator {
  constructor() {
    super();
    this.sqlOperator = 'not in';
  }
}
