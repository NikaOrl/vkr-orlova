import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { GroupTableComponent } from './group-table.component';
import { GroupsApiService } from '../../services/groups-api.service';
import { ActivatedRouteStub, RouterLinkStubDirective, RouterStub } from '../../../shared/utils/tests-stubs';
import { GroupsApiServiceStub } from '../../services/groups-api.service.spec';
import { getTranslocoModule } from '../../../transloco/transloco-testing.module';

describe('GroupTableComponent', () => {
  let component: GroupTableComponent;
  let fixture: ComponentFixture<GroupTableComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [GroupTableComponent, RouterLinkStubDirective],
      imports: [
        FormsModule,
        MatFormFieldModule,
        MatTableModule,
        MatSelectModule,
        MatInputModule,
        MatAutocompleteModule,
        NoopAnimationsModule,
        getTranslocoModule(),
      ],
      providers: [
        HttpClientTestingModule,
        { provide: GroupsApiService, useClass: GroupsApiServiceStub },
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupTableComponent);
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
    component.groups = [
      { id: '1', groupNumber: '1' },
      { id: '2', groupNumber: '2' },
    ];
    component.selectValue = '1';
    component.filter();
    expect(component.filteredGroups).toEqual([{ id: '1', groupNumber: '1' }]);
  });
});
