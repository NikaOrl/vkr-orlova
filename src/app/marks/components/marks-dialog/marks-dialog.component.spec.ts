import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { MarksDialogComponent } from './marks-dialog.component';

// tslint:disable-next-line:component-selector
@Component({ selector: 'mat-form-field', template: '' })
class MatFormFieldStubComponent {}

describe('MarksDialogComponent', () => {
  let component: MarksDialogComponent;
  let fixture: ComponentFixture<MarksDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MarksDialogComponent, MatFormFieldStubComponent],
      imports: [
        FormsModule,
        // TODO: fix this import
        MatDialogModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarksDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
