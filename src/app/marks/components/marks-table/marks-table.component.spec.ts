import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { ActivatedRouteStub, RouterLinkStubDirective, RouterStub } from '../../../shared/utils/tests-stubs';
import { MarksTableComponent } from './marks-table.component';
import { MarksApiService } from '../../services/marks-api.service';
import { MarksApiServiceStub } from '../../services/marks-api.service.spec';
import { IDiscipline } from '../../models/discipline.model';

describe('MarksTableComponent', () => {
  let component: MarksTableComponent;
  let fixture: ComponentFixture<MarksTableComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [MarksTableComponent, RouterLinkStubDirective],
      imports: [
        FormsModule,
        MatFormFieldModule,
        MatTableModule,
        MatSelectModule,
        MatInputModule,
        MatAutocompleteModule,
        NoopAnimationsModule,
        MatDialogModule,
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

  it('should filter disciplines', () => {
    component.disciplines = [
      { id: 1, disciplineValue: 'a' } as IDiscipline,
      { id: 2, disciplineValue: 'b' } as IDiscipline,
    ];

    component.selectValue = 'c';
    component.filter();
    expect(component.filteredDisciplines).toEqual([]);
    component.selectedDiscipline = { id: 1, disciplineValue: 'a' } as IDiscipline;
    component.onSelectedDisciplineChange();

    component.selectValue = 'a';
    component.filter();
    expect(component.filteredDisciplines).toEqual([{ id: 1, disciplineValue: 'a' } as IDiscipline]);
  });
});
