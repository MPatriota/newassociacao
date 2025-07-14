import {Component, ContentChildren, Input, QueryList} from '@angular/core';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import {CrudDetailColumnComponent} from './crud-detail-column.component';

@Component({
  selector: 'crud-detail',
  templateUrl: 'crud-detail.component.html',
  standalone: false
})
export class CrudDetailComponent {

  @Input({required: true}) formArray!: FormArray;
  @Input({required: true}) createForm!: () => FormGroup;
  @Input({required: true}) set children(children: any[] | undefined) {
    this.createChildren(children);
  }

  @ContentChildren(CrudDetailColumnComponent) columns!: QueryList<CrudDetailColumnComponent>;

  rowId = 0;
  editingRowKeys: {[key: number]: boolean} = {};

  private createChildren(children: any) {
    if(!children) {
      return;
    }

    children.forEach((child: any) => {
      let addedChildForm = this.addChild(false);
      addedChildForm.patchValue(child);
    })
  }

  addChild(editMode = true) {
    const rowId = this.rowId++;

    if(editMode) {
      this.editingRowKeys[rowId] = true;
    }

    const form = this.createForm();
    form.addControl("rowId", new FormControl(rowId));

    this.formArray.push(form);

    return form;
  }

  saveChild(childValue: any, rowIndex: number) {
    this.formArray.at(rowIndex).patchValue(childValue);
  }

  deleteChild(rowIndex: number) {
    this.formArray.removeAt(rowIndex);
  }
}
