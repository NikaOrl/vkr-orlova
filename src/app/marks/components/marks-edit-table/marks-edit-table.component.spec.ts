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

import { MarksEditTableComponent } from './marks-edit-table.component';
import { IMark } from '../../models/mark.model';
import { DialogService } from '../../../core/services/dialog.service';
import { MarksApiService } from '../../services/marks-api.service';
import { ActivatedRouteStub, RouterLinkStubDirective, RouterStub } from '../../../shared/utils/tests-stubs';
import { MarksApiServiceStub } from '../../services/marks-api.service.spec';
import { getTranslocoModule } from '../../../transloco/transloco-testing.module';

describe('MarksEditTableComponent', () => {
  let component: MarksEditTableComponent;
  let fixture: ComponentFixture<MarksEditTableComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [MarksEditTableComponent, RouterLinkStubDirective],
      imports: [
        FormsModule,
        MatTableModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatButtonModule,
        MatSortModule,
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
    fixture = TestBed.createComponent(MarksEditTableComponent);
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
    expect(component.isAdded('-1')).toBe(true);
    expect(component.isAdded('1')).toBe(false);

    component.delete('1');
    expect(component.isDeleted('1')).toBe(true);
    expect(component.isDeleted('2')).toBe(false);

    component.markChange(5, '0', 1);
    component.jobChange('5', 1);

    component.cancelAdd('-1');

    component.cancelDelete('1');
    expect(component.isDeleted('1')).toBe(false);
  });
});
