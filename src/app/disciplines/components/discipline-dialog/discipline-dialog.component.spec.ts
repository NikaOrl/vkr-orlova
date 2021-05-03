import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { DisciplineDialogComponent } from './discipline-dialog.component';
import { getTranslocoModule } from '../../../transloco/transloco-testing.module';
import { DisciplinesApiService } from '../../services/disciplines-api.service';
import { DisciplinesApiServiceStub } from '../../services/disciplines-api.service.spec';

describe('DisciplineDialogComponent', () => {
  let component: DisciplineDialogComponent;
  let fixture: ComponentFixture<DisciplineDialogComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [DisciplineDialogComponent],
      imports: [
        ReactiveFormsModule,
        MatDialogModule,
        MatChipsModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatInputModule,
        MatSlideToggleModule,
        NoopAnimationsModule,
        getTranslocoModule(),
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: DisciplinesApiService, useClass: DisciplinesApiServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisciplineDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
