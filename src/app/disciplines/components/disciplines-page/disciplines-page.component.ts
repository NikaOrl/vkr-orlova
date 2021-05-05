import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { ITeacher } from '../../../teachers/models/teacher.model';
import { IDiscipline } from '../../models/discipline.model';
import { ISemester } from '../../models/semester.model';
import { DisciplinesApiService } from '../../services/disciplines-api.service';
import { DisciplineDeleteDialogComponent } from '../discipline-delete-dialog/discipline-delete-dialog.component';
import { DisciplineDialogComponent } from '../discipline-dialog/discipline-dialog.component';
import { DisciplineSemesterDialogComponent } from '../discipline-semester-dialog/discipline-semester-dialog.component';
import { DisciplineStudentsDialogComponent } from '../discipline-students-dialog/discipline-students-dialog.component';

@Component({
  selector: 'app-disciplines-page',
  templateUrl: './disciplines-page.component.html',
  styleUrls: ['./disciplines-page.component.css'],
})
export class DisciplinesPageComponent implements OnInit {
  public disciplines: Observable<IDiscipline[]>;
  public teachers: ITeacher[];

  public selectValue: string | ISemester;
  public selectedSemester: ISemester;
  public semesters: ISemester[];
  public filteredSemesters: ISemester[];

  constructor(private api: DisciplinesApiService, public dialog: MatDialog) {}

  public ngOnInit(): void {
    this.api.getSemesters().subscribe(
      semesters => {
        this.semesters = semesters;
        const selectedSemesterId: string = this.semesters[this.semesters.length - 1].id;
        this.selectedSemester = selectedSemesterId
          ? this.semesters.find(semester => semester.id === selectedSemesterId)
          : this.semesters[0];
        this.selectValue = this.selectedSemester?.semesterName ? this.selectedSemester.semesterName.toString() : '';
        this.filteredSemesters = this.semesters;
        this.disciplines = this.api.getDisciplines(selectedSemesterId);
      },
      err => {
        console.log(err);
      }
    );
    this.api.getTeachers().subscribe(
      (teachers: ITeacher[]) => {
        this.teachers = teachers;
      },
      err => {
        console.log(err);
      }
    );
  }

  public selectSemester(semester: ISemester): void {
    this.selectedSemester = semester;
    this.disciplines = this.api.getDisciplines(this.selectedSemester.id);
  }

  public filter(): void {
    const filterValue: string = this.displayFn(this.selectValue);
    this.filteredSemesters = this.semesters.filter(
      option => `${option.semesterName}`.toLowerCase().indexOf(filterValue.toLowerCase()) === 0
    );
    this.selectValue = filterValue;
  }

  public displayFn(semester: ISemester | string): string {
    if (semester) {
      return (semester as ISemester).semesterName
        ? (semester as ISemester).semesterName.toString()
        : (semester as string);
    }
    return '';
  }

  public getDisciplineTeachers(discipline: IDiscipline): ITeacher[] {
    if (this.teachers) {
      return this.teachers.filter((t: ITeacher) => discipline.teacherIds && discipline.teacherIds.includes(t.id));
    }
  }

  public openStudentsDialog(disciplineId: string, disciplineName: string): void {
    this.dialog.open(DisciplineStudentsDialogComponent, {
      width: '550px',
      data: { disciplineId, disciplineName },
    });
  }

  public openEditDialog(discipline: IDiscipline): void {
    this.dialog.open(DisciplineDialogComponent, {
      width: '1000px',
      data: { discipline, teachers: this.teachers, semesters: this.semesters },
    });
  }

  public delete(discipline: IDiscipline): void {
    this.dialog.open(DisciplineDeleteDialogComponent, {
      width: '550px',
      data: { discipline },
    });
  }

  public addSemester(): void {
    this.dialog.open(DisciplineSemesterDialogComponent, {
      width: '550px',
    });
  }

  public addDiscipline(): void {
    this.dialog.open(DisciplineDialogComponent, {
      width: '1000px',
      data: { teachers: this.teachers, semesters: this.semesters },
    });
  }

  public get isAdmin(): boolean {
    const user: string = localStorage.getItem('currentUser');
    return user && `${user}` !== 'undefined' ? JSON.parse(user).isAdmin : false;
  }
}
