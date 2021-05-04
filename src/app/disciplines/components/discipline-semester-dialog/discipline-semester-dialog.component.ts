import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { MatDialogRef } from '@angular/material/dialog';

import { DisciplinesApiService } from '../../services/disciplines-api.service';
import { ISemesterBase } from '../../models/semester.model';

const newSemester: ISemesterBase = {
  semesterName: '',
};

@Component({
  selector: 'app-discipline-semester-dialog',
  templateUrl: './discipline-semester-dialog.component.html',
  styleUrls: ['./discipline-semester-dialog.component.scss'],
})
export class DisciplineSemesterDialogComponent implements OnInit {
  public semester: ISemesterBase;
  public semesterForm: FormGroup = new FormGroup({
    semesterName: new FormControl('', [Validators.required]),
  });

  constructor(public dialogRef: MatDialogRef<DisciplineSemesterDialogComponent>, private api: DisciplinesApiService) {}

  public ngOnInit(): void {
    this.semester = newSemester;

    this.semesterForm.controls.semesterName.setValue('');
  }

  public onNoClick(): void {
    this.dialogRef.close();
  }

  public onSaveClick(): void {
    if (this.semesterForm.valid) {
      this.semester.semesterName = this.semesterForm.controls.semesterName.value;
      this.api.addSemester(this.semester as ISemesterBase).subscribe(res => {
        this.dialogRef.close();
      });
    }
  }
}
