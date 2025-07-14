import { ValidationErrors } from '@angular/forms';
import { ValidatorMessageChain } from './validator-message-chain';

export class ValidatorMessageEmptyArray implements ValidatorMessageChain {

  constructor(private readonly nextChain?: ValidatorMessageChain) {
    this.nextChain = nextChain;
  }

  chain(
    error: string,
    violations: ValidationErrors,
    addElement: (param: {
      key: string;
      elementMessage: string;
      created: boolean;
    }) => void
  ): void {
    if (error === 'emptyArray') {
      addElement({
        key: 'emptyArray',
        elementMessage: 'Campo deve ter pelo menos um item',
        created: false,
      });
    }
    this.nextChain?.chain(error, violations, addElement);
  }
}
