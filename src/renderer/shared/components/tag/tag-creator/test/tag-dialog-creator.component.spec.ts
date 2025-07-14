import { ComponentFixture, TestBed } from '@angular/core/testing';
import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone/index';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TagService } from '../../../../services/tag.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TagDialogCreatorComponent } from '../tag-dialog-creator.component';

describe('TagDialogCreator', () => {
  let component: TagDialogCreatorComponent;
  let fixture: ComponentFixture<TagDialogCreatorComponent>;
  let messageService: MessageService;
  let confirmationService: ConfirmationService;

  const tagServiceMock = {
    save: jest.fn(),
    findAll: jest.fn(),
    delete: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    findBySlug: jest.fn()
  };

  beforeEach(async () => {
    tagServiceMock.findAll.mockReturnValue(of({ content: [{ name: 'test' }] }));
    tagServiceMock.save.mockReturnValue(of({}));
    tagServiceMock.findBySlug.mockReturnValue(of(null));
    tagServiceMock.delete.mockReturnValue(of({}));
    tagServiceMock.update.mockReturnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        TagDialogCreatorComponent
      ],
      providers: [
        { provide: TagService, useValue: tagServiceMock },
        MessageService,
        ConfirmationService
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TagDialogCreatorComponent);
    component = fixture.componentInstance;
    messageService = TestBed.inject(MessageService);
    confirmationService = TestBed.inject(ConfirmationService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call update partial', () => {
    component.originalValue = { id: 1, name: 'test', color: '#fffff' };
    component.formTag.patchValue({ id: 1, name: 'test updated', color: '#fffff2' });
    component.onSaveTag();

    expect(tagServiceMock.update).toHaveBeenCalledWith(1, expect.arrayContaining([
      expect.objectContaining({ op: 'replace', path: '/name', value: 'test updated' }),
      expect.objectContaining({ op: 'replace', path: '/color', value: '#fffff2' })
    ]));
  });

  it('should save new tag when no existing tag is found', () => {
    const newTag = { id: null, name: 'new tag', color: '#123456' };
    component.formTag.patchValue(newTag);
    component.onSaveTag();

    expect(tagServiceMock.save).toHaveBeenCalledWith(newTag);
  });

  it('should emit onChange and visibleChange after successful save', () => {
    const onChangeSpy = jest.spyOn(component.onChange, 'emit');
    const visibleChangeSpy = jest.spyOn(component.visibleChange, 'emit');

    component.formTag.patchValue({ name: 'new tag', color: '#123456' });
    component.onSaveTag();

    expect(onChangeSpy).toHaveBeenCalled();
    expect(visibleChangeSpy).toHaveBeenCalledWith(false);
  });

  it('should select color correctly', () => {
    const color = '#2196F3';
    component.selectColor(color);

    expect(component.formTag.get('color')?.value).toBe(color);
  });

  it('should show success message after saving', () => {
    const spy = jest.spyOn(messageService, 'add');

    component.formTag.patchValue({ name: 'new tag', color: '#123456' });
    component.onSaveTag();

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Tag salva com sucesso'
      })
    );
  });

  it('should handle quiosque-creator validation', () => {
    expect(component.formTag.valid).toBeFalsy();

    component.formTag.patchValue({ name: 'test', color: '#123456' });
    expect(component.formTag.valid).toBeTruthy();

    component.formTag.patchValue({ name: '', color: '#123456' });
    expect(component.formTag.valid).toBeFalsy();
  });
});
