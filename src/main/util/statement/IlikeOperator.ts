import { LikeOperator } from './likeOperator';

export class ILikeOperator extends LikeOperator {
  constructor() {
    super();
    this.sqlOperator = 'ilike';
  }
}
