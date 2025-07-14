import { Directive, ElementRef, OnDestroy, OnInit, Optional, Renderer2, } from '@angular/core';
import { FormControlName } from '@angular/forms';
import { ValidatorMessageHandler } from './chain/validator-message-handler';

@Directive({ selector: '[formValidateMessage]', standalone: true })
export class FormValidateMessageDirective implements OnInit, OnDestroy {

  private validatorElement?: Element;

  private createElementsType: {
    key: string;
    elementMessage: string;
    created: boolean;
    element: any[];
  }[] = [];

  private validatorMessageHandler: ValidatorMessageHandler = new ValidatorMessageHandler();

  constructor(
    @Optional() private formControlName: FormControlName,
    protected renderer: Renderer2,
    protected elementRef: ElementRef
  ) {
  }

  ngOnInit(): void {
    this.createMessageValidatorElement();
    this.handleStatusChanges();
  }

  ngOnDestroy(): void {
    this.clearViolations();
  }

  private handleStatusChanges() {
    if (this.formControlName) {
      this.formControlName.statusChanges?.subscribe((status) => {
          status === 'INVALID'
            ? this.handleInvalidStatus()
            : this.clearViolations();
        }
      );
    }
  }

  private clearViolations() {
    if (this.hasElementsToDeleteOnParent()) {
      this.removeErrorHint();
      this.createElementsType.forEach((elementGroup) =>
        this.removeElementsByGroup(elementGroup)
      );
      this.createElementsType = [];
    }
  }

  private removeElementsByGroup(elementGroup: {
    key: string;
    elementMessage: string;
    created: boolean;
    element: any[];
  }) {
    elementGroup.element.forEach((el) => {
      if (this.validatorElement?.contains(el)) {
        this.renderer.removeChild(this.validatorElement, el);
      }
    });
  }

  private removeErrorHint() {
    this.renderer.removeClass(this.elementRef.nativeElement, 'ng-invalid');
  }

  private hasElementsToDeleteOnParent() {
    return this.validatorElement && this.createElementsType.length > 0;
  }

  private handleInvalidStatus() {
    const errorsKey = Object.keys(this.formControlName.errors ?? {});
    errorsKey.forEach((error) => {
      this.validatorMessageHandler.handle(
        error,
        this.formControlName.errors ?? {},
        this.createElementsType
      );
    });

    if (this.containsViolations()) {
      this.createElementsType.forEach((child) => {
        this.createElementChild(child);
      });
    }
  }

  private createElementChild(child: {
    key: string;
    elementMessage: string;
    created: boolean;
    element: any[];
  }) {
    if (!child.created) {
      child.created = true;
      const breakLine = this.renderer.createElement('br');
      this.attrElements(child, breakLine);
      this.appendElementsOnDocument(child);
      this.renderer.addClass(this.elementRef.nativeElement, 'ng-invalid');
    }
  }

  private appendElementsOnDocument(child: {
    key: string;
    elementMessage: string;
    created: boolean;
    element: any[];
  }) {
    child.element.forEach((element) =>
      this.renderer.appendChild(this.validatorElement, element)
    );
  }

  private attrElements(
    child: {
      key: string;
      elementMessage: string;
      created: boolean;
      element: any[];
    },
    breakLine: any
  ) {
    child.element = [document.createTextNode(child.elementMessage), breakLine];
  }

  private containsViolations() {
    return this.createElementsType.length > 0;
  }

  private createMessageValidatorElement() {
    this.validatorElement = this.renderer.createElement('small');
    this.renderer.setStyle(this.validatorElement, 'color', 'red');
    this.renderer.setStyle(this.validatorElement, 'display', 'block');
    this.renderer.setStyle(this.validatorElement, 'font-size', '10px');
    this.renderer.setStyle(this.validatorElement, 'margin-top', '4px');
    const parent = this.elementRef.nativeElement.parentNode;
    this.renderer.insertBefore(
      parent,
      this.validatorElement,
      this.renderer.nextSibling(this.elementRef.nativeElement)
    );
  }
}
