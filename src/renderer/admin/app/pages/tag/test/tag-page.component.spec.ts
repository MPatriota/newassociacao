import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TagPageComponent } from '../tag-page.component';
import { TagPageModule } from '../tag-page.module';
import { TagService } from '../../../../../shared/services/tag.service';
import { Confirmation, MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';
import { Tag } from '../../../../../shared/model/tag.model';

describe('TagPageComponent', () => {

  let component: TagPageComponent;
  let fixture: ComponentFixture<TagPageComponent>;

  const tagServiceMock = {
    save: jest.fn(),
    findAll: jest.fn(),
    delete: jest.fn(),
    findById: jest.fn()
  };

  beforeEach(async () => {

    tagServiceMock.findAll.mockReturnValue(of({ content: [{ name: 'test' }] }));
    tagServiceMock.save.mockReturnValue(of({}));
    tagServiceMock.delete.mockReturnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        TagPageModule
      ],
      providers: [
        { provide: TagService, useValue: tagServiceMock },
        MessageService
      ]
    }).compileComponents();

  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TagPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call fetch on init', () => {

    component.ngOnInit();

    expect(tagServiceMock.findAll).toHaveBeenCalled();

    // @ts-ignore
    expect(component.page?.content).toEqual([{ name: 'test' }]);

  });

  it('should call fetch when delete a tag', () => {

    const tag = { id: 1, name: 'test' } as Tag;

    const confirmSpy = jest.spyOn(component['_confirmationService'], 'confirm')
      .mockImplementation((options: Confirmation) => {
        if (options.accept) {
          options.accept();
        }
        return {} as any;
      });

    component.onDeleteTag(tag);

    expect(confirmSpy).toHaveBeenCalled();

    expect(tagServiceMock.delete).toHaveBeenCalledWith(tag.id);

    expect(tagServiceMock.findAll).toHaveBeenCalled();

  });

  it('should call fetch when edit a tag', () => {

    const tag = { id: 1, name: 'test' } as Tag;

    component.onEditTag(tag);

    expect(component.formTag.value).toEqual(tag);
    expect(component.createVisible).toBeTruthy();

  });


});
