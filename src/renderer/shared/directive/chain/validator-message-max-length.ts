import { ValidationErrors } from '@angular/forms';
import { ValidatorMessageChain } from './validator-message-chain';

export class ValidatorMessageMaxLength implements ValidatorMessageChain {
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
    if (error === 'maxlength') {
      addElement({
        key: error,
        elementMessage: `O campo deve ter no máximo ${violations['maxlength']['requiredLength']} caracteres`,
        created: false,
      });
    }
    this.nextChain?.chain(error, violations, addElement);
  }
}
