import { EqualsOperator } from './equalsOperator';
import { NotEqualsOperator } from './notEqualsOperator';
import { GreaterThanOperator } from './greaterThanOperator';
import { GreaterThanEqualsOperator } from './greaterThanEqualsOperator';
import { LessThanOperator } from './lessThanOperator';
import { LessThanEqualsOperator } from './lessThanEqualsOperator';
import { LikeOperator } from './likeOperator';
import { InOperator } from './inOperator';
import { NotInOperator } from './notInOperator';
import { IOperator } from './base.operator';
import { NotLikeOperator } from './notLikeOperator';
import { ILikeOperator } from './IlikeOperator';

export class OperatorRegistry {

  private static instance: OperatorRegistry;
  private operators: Map<string, IOperator> = new Map();

  private constructor() {
    this.registerDefaults();
  }

  static getInstance(): OperatorRegistry {
    if (!OperatorRegistry.instance) {
      OperatorRegistry.instance = new OperatorRegistry();
    }
    return OperatorRegistry.instance;
  }

  getOperator(symbol: string): IOperator | undefined {
    return this.operators.get(symbol);
  }

  getOperatorSymbols(): string[] {
    return Array.from(this.operators.keys());
  }

  private registerDefaults() {
    this.operators.set('==', new EqualsOperator());
    this.operators.set('!=', new NotEqualsOperator());
    this.operators.set('>', new GreaterThanOperator());
    this.operators.set('>=', new GreaterThanEqualsOperator());
    this.operators.set('<', new LessThanOperator());
    this.operators.set('<=', new LessThanEqualsOperator());
    this.operators.set('=like=', new LikeOperator());
    this.operators.set('=ilike=', new ILikeOperator());
    this.operators.set('=notlike=', new NotLikeOperator());
    this.operators.set('=in=', new InOperator());
    this.operators.set('=notin=', new NotInOperator());
  }

}
