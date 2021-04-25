import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { GroupsEditComponent } from './groups-edit.component';
import { GroupsApiService } from '../../services/groups-api.service';
import { IStudent } from '../../models/student.model';
import { DialogService } from '../../../core/services/dialog.service';
import { ActivatedRouteStub, RouterLinkStubDirective, RouterStub } from '../../../shared/utils/tests-stubs';
import { DialogServiceStub } from '../../../core/services/dialog.service.spec';
import { GroupsApiServiceStub } from '../../services/groups-api.service.spec';
import { getTranslocoModule } from '../../../transloco/transloco-testing.module';

describe('GroupsEditComponent', () => {
  let component: GroupsEditComponent;
  let fixture: ComponentFixture<GroupsEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GroupsEditComponent, RouterLinkStubDirective],
      imports: [
        FormsModule,
        MatSelectModule,
        MatTableModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSortModule,
        MatCheckboxModule,
        NoopAnimationsModule,
        getTranslocoModule(),
      ],
      providers: [
        { provide: DialogService, DialogServiceStub },
        { provide: GroupsApiService, useClass: GroupsApiServiceStub },
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupsEditComponent);
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
    expect(component.isAdded({ id: null } as IStudent)).toBe(true);
    expect(component.isAdded({ id: 2 } as IStudent)).toBe(false);

    component.delete({ id: 1 } as IStudent);
    expect(component.isDeleted({ id: 1 } as IStudent)).toBe(true);
    expect(component.isDeleted({ id: 2 } as IStudent)).toBe(false);
    component.unsaved();
    component.save();

    expect(component.canDeactivate()).toBe(true);
    component.cancelAdd({ id: null } as IStudent);

    component.cancelDelete({ id: 1 } as IStudent);
    expect(component.isDeleted({ id: 1 } as IStudent)).toBe(false);
  });
});
