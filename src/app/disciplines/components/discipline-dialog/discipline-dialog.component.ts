import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ITeacher } from '../../../teachers/models/teacher.model';
import { IDiscipline, IDisciplineBase } from '../../models/discipline.model';
import { DisciplinesApiService } from '../../services/disciplines-api.service';

const newDiscipline: IDisciplineBase = { disciplineValue: '', semesterId: null, teacherIds: [] };

@Component({
  selector: 'app-discipline-dialog',
  templateUrl: './discipline-dialog.component.html',
  styleUrls: ['./discipline-dialog.component.scss'],
})
export class DisciplineDialogComponent implements OnInit {
  public discipline: IDiscipline | IDisciplineBase;

  public selectable: boolean = true;
  public removable: boolean = true;
  public separatorKeysCodes: number[] = [ENTER, COMMA];
  public disciplineForm: FormGroup = new FormGroup({
    disciplineName: new FormControl('', [Validators.required]),
  });
  public teacherCtrl: FormControl = new FormControl();
  public filteredTeachers: Observable<ITeacher[]>;
  public selectedTeachers: ITeacher[] = [];

  @ViewChild('teacherInput') public teacherInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') public matAutocomplete: MatAutocomplete;

  constructor(
    public dialogRef: MatDialogRef<DisciplineDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { discipline?: IDiscipline; teachers: ITeacher[] },
    private api: DisciplinesApiService
  ) {}

  public ngOnInit(): void {
    this.discipline = this.data.discipline ? this.data.discipline : newDiscipline;

    this.disciplineForm.controls.disciplineName.setValue(this.discipline ? this.discipline.disciplineValue : '');

    if (this.data.teachers) {
      this.selectedTeachers = this.data.teachers.filter(
        (teacher: ITeacher) => this.discipline.teacherIds && this.discipline.teacherIds.includes(teacher.id)
      );

      this.filteredTeachers = this.teacherCtrl.valueChanges.pipe(
        startWith(null as string),
        map((teacher: string | ITeacher | null) =>
          teacher && !(teacher as ITeacher).id
            ? this._filter(teacher as string)
            : this.data.teachers.filter((t: ITeacher) => !this.selectedTeachers.includes(t))
        )
      );
    }
  }

  public remove(teacher: ITeacher): void {
    const index: number = this.selectedTeachers.indexOf(teacher);

    if (index >= 0) {
      this.selectedTeachers.splice(index, 1);
    }
  }

  public selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedTeachers.push(event.option.value);
    this.teacherInput.nativeElement.value = '';
    this.teacherCtrl.setValue(null);
  }

  public onNoClick(): void {
    this.dialogRef.close();
  }

  public onSaveClick(): void {
    if (this.disciplineForm.valid) {
      this.discipline.disciplineValue = this.disciplineForm.controls.disciplineName.value;
      this.discipline.teacherIds = this.selectedTeachers.map(teacher => teacher.id);
      if (this.data.discipline) {
        this.api.updateDiscipline(this.discipline as IDiscipline).subscribe(res => {
          this.dialogRef.close();
        });
      } else {
        this.api.addDiscipline(this.discipline as IDisciplineBase).subscribe(res => {
          this.dialogRef.close();
        });
      }
    }
  }

  private _filter(value: string): ITeacher[] {
    const filterValue: string = value.toLowerCase();

    return this.data.teachers.filter(
      teacher =>
        `${teacher.firstName} ${teacher.lastName}`.toLowerCase().indexOf(filterValue) === 0 &&
        !this.selectedTeachers.includes(teacher)
    );
  }
}
