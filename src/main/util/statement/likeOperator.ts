import { BaseOperator } from "./base.operator";

export class LikeOperator extends BaseOperator {
  constructor() {
    super('like');
  }

  override formatValue(value: string): string {
    return value.replace(/\*/g, '%');
  }
}
