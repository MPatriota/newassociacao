import { ValidationErrors } from '@angular/forms';
import { ValidatorMessageChain } from './validator-message-chain';

export class ValidatorMessageGeneric implements ValidatorMessageChain {
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
    if (error === 'genericMessage') {
      addElement({
        key: 'genericMessage',
        elementMessage: violations['genericMessage'],
        created: false,
      });
    }
    this.nextChain?.chain(error, violations, addElement);
  }
}
