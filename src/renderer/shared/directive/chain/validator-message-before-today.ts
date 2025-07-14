import { ValidationErrors } from '@angular/forms';
import { ValidatorMessageChain } from './validator-message-chain';

export class ValidatorMessageBeforeToday implements ValidatorMessageChain {

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
    if (error === 'beforeToday') {
      addElement({
        key: 'beforeToday',
        elementMessage: 'Data deve ser igual ou posterior a data atual',
        created: false,
      });
    }
    this.nextChain?.chain(error, violations, addElement);
  }
}
