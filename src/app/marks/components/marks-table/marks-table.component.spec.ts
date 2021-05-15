import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CdkTableModule } from '@angular/cdk/table';

import { ActivatedRouteStub, RouterLinkStubDirective, RouterStub } from '../../../shared/utils/tests-stubs';
import { MarksTableComponent } from './marks-table.component';
import { MarksApiService } from '../../services/marks-api.service';
import { MarksApiServiceStub } from '../../services/marks-api.service.spec';
import { IGroup } from '../../../groups/models/group.model';
import { getTranslocoModule } from '../../../transloco/transloco-testing.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

describe('MarksTableComponent', () => {
  let component: MarksTableComponent;
  let fixture: ComponentFixture<MarksTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MarksTableComponent, RouterLinkStubDirective],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatTableModule,
        MatSelectModule,
        MatInputModule,
        MatAutocompleteModule,
        NoopAnimationsModule,
        MatDialogModule,
        MatSlideToggleModule,
        CdkTableModule,
        getTranslocoModule(),
      ],
      providers: [
        { provide: MarksApiService, useClass: MarksApiServiceStub },
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarksTableComponent);
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

  it('should filter groups', () => {
    component.groups = [{ id: '1', groupNumber: '1' } as IGroup, { id: '2', groupNumber: '2' } as IGroup];

    component.groupSelectValue = '0';
    component.filterGroups();
    expect(component.filteredGroups).toEqual([]);
    component.selectGroup({ id: '1', groupNumber: '1' } as IGroup);

    component.groupSelectValue = '1';
    component.filterGroups();
    expect(component.filteredGroups).toEqual([{ id: '1', groupNumber: '1' } as IGroup]);
  });
});
