import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { CdkTableModule } from '@angular/cdk/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';

import { MarksEditAttendanceComponent } from './marks-edit-attendance.component';
import { DialogService } from '../../../core/services/dialog.service';
import { MarksApiService } from '../../services/marks-api.service';
import { ActivatedRouteStub, RouterLinkStubDirective, RouterStub } from '../../../shared/utils/tests-stubs';
import { MarksApiServiceStub } from '../../services/marks-api.service.spec';
import { getTranslocoModule } from '../../../transloco/transloco-testing.module';

describe('MarksEditAttendanceComponent', () => {
  let component: MarksEditAttendanceComponent;
  let fixture: ComponentFixture<MarksEditAttendanceComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [MarksEditAttendanceComponent, RouterLinkStubDirective],
      imports: [
        FormsModule,
        MatTableModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatButtonModule,
        MatSortModule,
        MatCheckboxModule,
        CdkTableModule,
        NoopAnimationsModule,
        getTranslocoModule(),
      ],
      providers: [
        DialogService,
        { provide: MarksApiService, useClass: MarksApiServiceStub },
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarksEditAttendanceComponent);
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

    component.add();
    expect(component.isAdded('-1')).toBe(true);
    expect(component.isAdded('1')).toBe(false);

    component.delete('1');
    expect(component.isDeleted('1')).toBe(true);
    expect(component.isDeleted('0')).toBe(false);

    component.attendanceMarkChange({ checked: true } as MatCheckbox, '1', 1);
    component.attendanceChange('5', 1);

    component.cancelDelete('1');
    expect(component.isDeleted('1')).toBe(false);
  });
});
