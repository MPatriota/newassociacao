import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CrudDetailComponent} from '../crud-detail.component';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import {CrudDetailModule} from '../crud-detail.module';

describe('CrudDetailComponent', () => {

  let fixture: ComponentFixture<CrudDetailComponent>;
  let component: CrudDetailComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudDetailModule],
    }).compileComponents();
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(CrudDetailComponent);
    component = fixture.componentInstance;

    component.formArray = new FormArray<any>([]);
    component.createForm = () => new FormGroup({
      id: new FormControl(),
      nome: new FormControl()
    });
    component.children = [];

    fixture.detectChanges();
  })

  it('should add child', () => {
    component.rowId = 0;
    expect(component.editingRowKeys[0]).toBeUndefined();

    component.addChild();

    expect(component.rowId).toEqual(1);
    expect(component.editingRowKeys[0]).toBeTruthy();
    expect(component.formArray.at(0).value.rowId).toEqual(0);
  })

  it('should save child', () => {
    component.addChild();

    const child = {
      nome: 'lucas'
    };

    component.saveChild(child, 0);

    expect(component.formArray.at(0).value.nome).toEqual('lucas');
  })

  it('should delete child', () => {
    expect(component.formArray.value.length).toEqual(0);

    component.addChild();
    component.addChild();
    component.addChild();

    expect(component.formArray.at(0).value.rowId).toEqual(0);
    expect(component.formArray.at(1).value.rowId).toEqual(1);
    expect(component.formArray.at(2).value.rowId).toEqual(2);
    expect(component.formArray.value.length).toEqual(3);

    component.deleteChild(1);

    expect(component.formArray.at(0).value.rowId).toEqual(0);
    expect(component.formArray.at(1).value.rowId).toEqual(2);
    expect(component.formArray.value.length).toEqual(2);

    component.deleteChild(0);

    expect(component.formArray.at(0).value.rowId).toEqual(2);
    expect(component.formArray.value.length).toEqual(1);
  })

  it('should create children by entity', () => {
    component.children = [
      {id: 1, nome: 'child 1'},
      {id: 2, nome: 'child 2'},
    ]

    expect(component.formArray.value.length).toEqual(2);

    const child1 = component.formArray.at(0).value;
    expect(child1.id).toEqual(1);
    expect(child1.nome).toEqual('child 1');
    expect(child1.rowId).toEqual(0);

    const child2 = component.formArray.at(1).value;
    expect(child2.id).toEqual(2);
    expect(child2.nome).toEqual('child 2');
    expect(child2.rowId).toEqual(1);
  })
})
