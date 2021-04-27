import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { DisciplineStudentsDialogComponent } from './discipline-students-dialog.component';
import { getTranslocoModule } from '../../../transloco/transloco-testing.module';
import { MatTreeModule } from '@angular/material/tree';
import { DisciplinesApiService } from '../../services/disciplines-api.service';
import { DisciplinesApiServiceStub } from '../../services/disciplines-api.service.spec';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

describe('DisciplineStudentsDialogComponent', () => {
  let component: DisciplineStudentsDialogComponent;
  let fixture: ComponentFixture<DisciplineStudentsDialogComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [DisciplineStudentsDialogComponent],
      imports: [FormsModule, MatDialogModule, MatTreeModule, MatIconModule, MatCheckboxModule, getTranslocoModule()],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: DisciplinesApiService, useClass: DisciplinesApiServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisciplineStudentsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
