import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ITeacher } from '../../../teachers/models/teacher.model';
import { IDiscipline, IDisciplineBase } from '../../models/discipline.model';
import { DisciplinesApiService } from '../../services/disciplines-api.service';
import { ISemester } from '../../models/semester.model';

const newDiscipline: IDisciplineBase = {
  disciplineValue: '',
  semesterId: null,
  teacherIds: [],
  countWithAttendance: true,
  marksAreas: { three: 0, four: 0, five: 0 },
};

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

  public selectedSemester: ISemester;
  public semesters: ISemester[];
  public filteredSemesters: ISemester[];

  public disciplineForm: FormGroup = new FormGroup({
    disciplineName: new FormControl('', [Validators.required]),
    countWithAttendance: new FormControl(true),
    three: new FormControl('', [Validators.required, Validators.min(1)]),
    four: new FormControl('', [Validators.required, Validators.min(1)]),
    five: new FormControl('', [Validators.required, Validators.min(1)]),
    semester: new FormControl('', [Validators.required]),
    semesterAuto: new FormControl(''),
    attendanceWeight: new FormControl(null, [Validators.min(0)]),
    selectedTeachers: new FormControl([], [Validators.required, Validators.minLength(1)]),
  });
  public teacherCtrl: FormControl = new FormControl();
  public filteredTeachers: Observable<ITeacher[]>;

  @ViewChild('teacherInput') public teacherInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') public matAutocomplete: MatAutocomplete;

  constructor(
    public dialogRef: MatDialogRef<DisciplineDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { discipline?: IDiscipline; teachers: ITeacher[]; semesters: ISemester[] },
    private api: DisciplinesApiService
  ) {}

  public ngOnInit(): void {
    this.discipline = this.data.discipline ? this.data.discipline : newDiscipline;
    this.semesters = this.data.semesters ? this.data.semesters : [];
    const selectedSemesterId: string = this.data.discipline
      ? this.discipline.semesterId
      : this.semesters[this.semesters.length - 1].id;
    const currentSemester: ISemester = selectedSemesterId
      ? this.semesters.find(semester => semester.id === selectedSemesterId)
      : this.semesters[0];
    this.filteredSemesters = this.semesters;
    this.disciplineForm.controls.semesterAuto.valueChanges.subscribe(() => this.filter());

    this.disciplineForm.controls.semesterAuto.setValue(currentSemester);
    this.disciplineForm.controls.semester.setValue(currentSemester);

    this.disciplineForm.controls.disciplineName.setValue(this.discipline ? this.discipline.disciplineValue : '');
    this.disciplineForm.controls.countWithAttendance.setValue(
      this.discipline ? this.discipline.countWithAttendance : false
    );
    this.disciplineForm.controls.three.setValue(
      this.discipline && this.discipline.marksAreas ? this.discipline.marksAreas.three : 0
    );
    this.disciplineForm.controls.four.setValue(
      this.discipline && this.discipline.marksAreas ? this.discipline.marksAreas.four : 0
    );
    this.disciplineForm.controls.five.setValue(
      this.discipline && this.discipline.marksAreas ? this.discipline.marksAreas.five : 0
    );
    this.disciplineForm.controls.attendanceWeight.setValue(this.discipline ? this.discipline.attendanceWeight : null);

    if (this.data.teachers) {
      this.disciplineForm.controls.selectedTeachers.setValue(
        this.data.teachers.filter(
          (teacher: ITeacher) => this.discipline.teacherIds && this.discipline.teacherIds.includes(teacher.id)
        )
      );

      this.filteredTeachers = this.teacherCtrl.valueChanges.pipe(
        startWith(null as string),
        map((teacher: string | ITeacher | null) =>
          teacher && !(teacher as ITeacher).id
            ? this._filter(teacher as string)
            : this.data.teachers.filter(
                (t: ITeacher) => !this.disciplineForm.controls.selectedTeachers.value.includes(t)
              )
        )
      );
    }
  }

  public selectSemester(semester: ISemester): void {
    this.disciplineForm.controls.semester.setValue(semester);
  }

  public filter(): void {
    const filterValue: string = this.displayFn(this.disciplineForm.controls.semesterAuto.value);
    this.filteredSemesters = this.semesters.filter(
      option => `${option.semesterName}`.toLowerCase().indexOf(`${filterValue}`.toLowerCase()) >= 0
    );
    if (this.disciplineForm.controls.semesterAuto.value !== filterValue) {
      this.disciplineForm.controls.semesterAuto.setValue(filterValue);
    }
  }

  public displayFn(semester: ISemester | string): string {
    if (semester) {
      return (semester as ISemester).semesterName
        ? (semester as ISemester).semesterName.toString()
        : (semester as string);
    }
    return '';
  }

  public remove(teacher: ITeacher): void {
    const index: number = this.disciplineForm.controls.selectedTeachers.value.indexOf(teacher);

    if (index >= 0) {
      this.disciplineForm.controls.selectedTeachers.value.splice(index, 1);
      this.disciplineForm.controls.selectedTeachers.setValue(this.disciplineForm.controls.selectedTeachers.value);
    }
  }

  public selected(event: MatAutocompleteSelectedEvent): void {
    this.disciplineForm.controls.selectedTeachers.setValue([
      ...this.disciplineForm.controls.selectedTeachers.value,
      event.option.value,
    ]);
    this.teacherInput.nativeElement.value = '';
    this.teacherCtrl.setValue(null);
  }

  public onNoClick(): void {
    this.dialogRef.close();
  }

  public onSaveClick(): void {
    Object.keys(this.disciplineForm.controls).forEach(field => {
      const control: AbstractControl = this.disciplineForm.get(field);
      control.markAsTouched({ onlySelf: true });
    });
    if (this.disciplineForm.valid) {
      this.discipline.disciplineValue = this.disciplineForm.controls.disciplineName.value;
      this.discipline.attendanceWeight = this.disciplineForm.controls.attendanceWeight.value;
      this.discipline.countWithAttendance = this.disciplineForm.controls.countWithAttendance.value;
      this.discipline.marksAreas = {
        three: this.disciplineForm.controls.three.value,
        four: this.disciplineForm.controls.four.value,
        five: this.disciplineForm.controls.five.value,
      };
      this.discipline.teacherIds = this.disciplineForm.controls.selectedTeachers.value.map(teacher => teacher.id);
      this.discipline.semesterId = this.disciplineForm.controls.semester.value.id;
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

  public get isAdmin(): boolean {
    const user: string = localStorage.getItem('currentUser');
    return user && `${user}` !== 'undefined' ? JSON.parse(user).isAdmin : false;
  }

  private _filter(value: string): ITeacher[] {
    const filterValue: string = value.toLowerCase();

    return this.data.teachers.filter(
      teacher =>
        `${teacher.firstName} ${teacher.lastName}`.toLowerCase().indexOf(filterValue) === 0 &&
        !this.disciplineForm.controls.selectedTeachers.value.includes(teacher)
    );
  }
}
