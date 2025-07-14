import { ValidationErrors } from '@angular/forms';
import { ValidatorMessageChain } from './validator-message-chain';

export class ValidatorMessageMinLength implements ValidatorMessageChain {
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
    if (error === 'minlength') {
      addElement({
        key: error,
        elementMessage: `O campo deve ter no mínimo ${violations['minlength']['requiredLength']} caracteres`,
        created: false,
      });
    }
    this.nextChain?.chain(error, violations, addElement);
  }
}
