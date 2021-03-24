import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';

import { GroupTableComponent } from './group-table.component';
import { GroupsApiService } from '../../services/groups-api.service';
import { ActivatedRouteStub, RouterLinkStubDirective, RouterStub } from '../../../shared/utils/tests-stubs';

export class GroupsApiServiceStub {
  public getStudents(groupId: number): Promise<unknown> {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve({ result: 'students' }));
      setTimeout(() => reject(new Error('ignored')));
    });
  }

  public getGroups(): Promise<unknown> {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve({ result: 'groups' }));
      setTimeout(() => reject(new Error('ignored')));
    });
  }
}

describe('GroupTableComponent', () => {
  let component: GroupTableComponent;
  let fixture: ComponentFixture<GroupTableComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [GroupTableComponent, RouterLinkStubDirective],
      imports: [FormsModule, MatFormFieldModule, MatTableModule, MatSelectModule, MatInputModule, NoopAnimationsModule],
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
    component.filterGroups('1');
    expect(component.filteredGroups).toBe(undefined);

    component.groups = [
      { id: 1, groupNumber: 1 },
      { id: 2, groupNumber: 2 },
    ];
    component.filterGroups('1');
    expect(component.filteredGroups).toEqual([{ id: 1, groupNumber: 1 }]);
  });
});
