import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockComponents } from 'ng-mocks';
import { MatTabsModule } from '@angular/material/tabs';

import { MarksEditComponent } from './marks-edit.component';
import { DialogService } from '../../../core/services/dialog.service';
import { ActivatedRouteStub, RouterLinkStubDirective } from '../../../shared/utils/tests-stubs';
import { getTranslocoModule } from '../../../transloco/transloco-testing.module';
import { MarksEditAttendanceComponent } from '../marks-edit-attendance/marks-edit-attendance.component';
import { MarksEditJobsComponent } from '../marks-edit-jobs/marks-edit-jobs.component';
import { MarksEditTableComponent } from '../marks-edit-table/marks-edit-table.component';

describe('MarksEditComponent', () => {
  let component: MarksEditComponent;
  let fixture: ComponentFixture<MarksEditComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [
        MarksEditComponent,
        RouterLinkStubDirective,
        MockComponents(MarksEditAttendanceComponent, MarksEditJobsComponent, MarksEditTableComponent),
      ],
      imports: [MatTabsModule, NoopAnimationsModule, getTranslocoModule()],
      providers: [DialogService, { provide: ActivatedRoute, useClass: ActivatedRouteStub }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarksEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
