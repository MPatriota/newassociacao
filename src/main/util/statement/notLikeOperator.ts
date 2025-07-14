import { LikeOperator } from './likeOperator';

export class NotLikeOperator extends LikeOperator {
  constructor() {
    super();
    this.sqlOperator = 'not like';
  }
}
