import {Component, ContentChild, Input, OnInit, TemplateRef} from '@angular/core';

@Component({
  selector: 'crud-detail-column',
  template: '',
  standalone: false
})
export class CrudDetailColumnComponent {

  @ContentChild('output') outputTemplate!: TemplateRef<any>;
  @ContentChild('input') inputTemplate!: TemplateRef<any>;

  @Input() field: string | undefined;
  @Input() header: string | undefined

}
