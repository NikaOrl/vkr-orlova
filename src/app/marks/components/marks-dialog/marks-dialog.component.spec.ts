import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { MarksDialogComponent } from './marks-dialog.component';
import { getTranslocoModule } from '../../../transloco/transloco-testing.module';

describe('MarksDialogComponent', () => {
  let component: MarksDialogComponent;
  let fixture: ComponentFixture<MarksDialogComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [MarksDialogComponent],
      imports: [
        FormsModule,
        MatDialogModule,
        MatInputModule,
        NoopAnimationsModule,
        MatFormFieldModule,
        getTranslocoModule(),
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarksDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
