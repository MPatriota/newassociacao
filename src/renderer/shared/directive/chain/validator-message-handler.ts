import { ValidationErrors } from '@angular/forms';
import { ValidatorMessageMinLength } from './validator-message-min-length';
import { ValidatorMessageRequired } from './validator-message-required';
import { ValidatorMessageEmptyArray } from './validator-message-empty-array';
import { ValidatorMessageMaxLength } from './validator-message-max-length';
import { ValidatorMessageNotBlank } from './validator-message-not-blank';
import { ValidatorMessageBeforeToday } from "./validator-message-before-today";
import { ValidatorMessageEmail } from "./validator-message-email";
import { ValidatorMessageGeneric } from './validator-message-generic';

export class ValidatorMessageHandler {
  private readonly firstChain: ValidatorMessageRequired;

  constructor() {
    const generic = new ValidatorMessageGeneric();
    const email = new ValidatorMessageEmail(generic);
    const notBlank = new ValidatorMessageNotBlank(email);
    const minLength = new ValidatorMessageMinLength(notBlank);
    const maxLength = new ValidatorMessageMaxLength(minLength);
    const beforeToday = new ValidatorMessageBeforeToday(maxLength);
    const emptyArray = new ValidatorMessageEmptyArray(beforeToday);
    this.firstChain = new ValidatorMessageRequired(emptyArray);
  }

  handle(
    error: string,
    violations: ValidationErrors,
    elements: { key: string; elementMessage: string; created: boolean }[]
  ): void {
    this.firstChain.chain(error, violations, this.addElement(elements));
  }

  private addElement(
    elements: { key: string; elementMessage: string; created: boolean }[]
  ) {
    return (param: {
      key: string;
      elementMessage: string;
      created: boolean;
    }) => {
      if (!elements.find((element) => element.key === param.key)) {
        elements.push(param);
      }
    };
  }
}
