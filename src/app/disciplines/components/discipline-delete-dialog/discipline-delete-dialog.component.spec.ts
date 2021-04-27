import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { DisciplineDeleteDialogComponent } from './discipline-delete-dialog.component';
import { getTranslocoModule } from '../../../transloco/transloco-testing.module';
import { DisciplinesApiService } from '../../services/disciplines-api.service';
import { DisciplinesApiServiceStub } from '../../services/disciplines-api.service.spec';

describe('DisciplineDeleteDialogComponent', () => {
  let component: DisciplineDeleteDialogComponent;
  let fixture: ComponentFixture<DisciplineDeleteDialogComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [DisciplineDeleteDialogComponent],
      imports: [FormsModule, MatDialogModule, getTranslocoModule()],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: DisciplinesApiService, useClass: DisciplinesApiServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisciplineDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
