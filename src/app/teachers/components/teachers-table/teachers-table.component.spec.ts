import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

import { TeachersTableComponent } from './teachers-table.component';
import { TeachersApiService } from '../../services/teachers-api.service';
import { RouterLinkStubDirective } from '../../../shared/utils/tests-stubs';
import { TeachersApiServiceStub } from '../../services/teachers-api.service.spec';

describe('TeachersTableComponent', () => {
  let component: TeachersTableComponent;
  let fixture: ComponentFixture<TeachersTableComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [TeachersTableComponent, RouterLinkStubDirective],
      imports: [
        FormsModule,
        MatTableModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSortModule,
        HttpClientModule,
        MatCheckboxModule,
        NoopAnimationsModule,
      ],
      providers: [HttpClientTestingModule, { provide: TeachersApiService, useClass: TeachersApiServiceStub }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeachersTableComponent);
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
});
