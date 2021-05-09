import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

import { TeachersEditComponent } from './teachers-edit.component';
import { TeachersApiService } from '../../services/teachers-api.service';
import { DialogService } from '../../../core/services/dialog.service';
import { ActivatedRouteStub, RouterStub } from '../../../shared/utils/tests-stubs';
import { DialogServiceStub } from '../../../core/services/dialog.service.spec';
import { TeachersApiServiceStub } from '../../services/teachers-api.service.spec';
import { ITeacher } from '../../models/teacher.model';
import { getTranslocoModule } from '../../../transloco/transloco-testing.module';

describe('TeachersEditComponent', () => {
  let component: TeachersEditComponent;
  let fixture: ComponentFixture<TeachersEditComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [TeachersEditComponent],
      imports: [
        FormsModule,
        MatTableModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        MatSortModule,
        MatCheckboxModule,
        NoopAnimationsModule,
        getTranslocoModule(),
      ],
      providers: [
        { provide: DialogService, DialogServiceStub },
        { provide: TeachersApiService, useClass: TeachersApiServiceStub },
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeachersEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change dataSource.filter', () => {
    component.applyFilter('a');
    expect(component.dataSource.filter).toBe('a');
  });

  it('should save', async () => {
    spyOn(window, 'confirm').and.returnValue(true);
    fixture.detectChanges(); // Run ngOnInit
    await fixture.whenStable();
    component.save();

    component.add();
    expect(component.isAdded('-3')).toBe(true);
    expect(component.isAdded('2')).toBe(false);

    component.delete('1');
    expect(component.isDeleted('1')).toBe(true);
    expect(component.isDeleted('2')).toBe(false);
    component.unsaved();
    component.save();

    expect(component.canDeactivate()).toBe(true);
    component.cancelAdd('-3');

    component.cancelDelete('1');
    expect(component.isDeleted('1')).toBe(false);
  });
});
