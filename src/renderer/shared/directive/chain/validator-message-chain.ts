import { ValidationErrors } from '@angular/forms';

export interface ValidatorMessageChain {
  chain(
    error: string,
    violations: ValidationErrors,
    addElement: (param: {
      key: string;
      elementMessage: string;
      created: boolean;
    }) => void
  ): void;
}
