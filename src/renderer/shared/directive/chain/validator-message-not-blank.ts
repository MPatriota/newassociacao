import { ValidationErrors } from '@angular/forms';
import { ValidatorMessageChain } from './validator-message-chain';

export class ValidatorMessageNotBlank implements ValidatorMessageChain {
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
    if (error === 'notBlank') {
      addElement({
        key: 'notBlank',
        elementMessage: `O campo não pode ser vazio`,
        created: false,
      });
    }
    this.nextChain?.chain(error, violations, addElement);
  }
}
