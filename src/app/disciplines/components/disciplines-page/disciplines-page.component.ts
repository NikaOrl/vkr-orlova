import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { ITeacher } from '../../../teachers/models/teacher.model';
import { IDiscipline } from '../../models/discipline.model';
import { DisciplinesApiService } from '../../services/disciplines-api.service';
import { DisciplineEditDialogComponent } from '../discipline-edit-dialog/discipline-edit-dialog.component';
import { DisciplineStudentsDialogComponent } from '../discipline-students-dialog/discipline-students-dialog.component';

@Component({
  selector: 'app-disciplines-page',
  templateUrl: './disciplines-page.component.html',
  styleUrls: ['./disciplines-page.component.css'],
})
export class DisciplinesPageComponent implements OnInit {
  public disciplines: Observable<IDiscipline[]>;
  public teachers: ITeacher[];

  constructor(private api: DisciplinesApiService, public dialog: MatDialog) {}

  public ngOnInit(): void {
    this.disciplines = this.api.getDisciplines();
    this.api.getTeachers().subscribe((teachers: ITeacher[]) => {
      this.teachers = teachers;
    });
  }

  public getDisciplineTeachers(discipline: IDiscipline): ITeacher[] {
    if (this.teachers) {
      return this.teachers.filter((t: ITeacher) => discipline.teacherIds && discipline.teacherIds.includes(t.id));
    }
  }

  public openStudentsDialog(disciplineId: number): void {
    this.dialog.open(DisciplineStudentsDialogComponent, {
      width: '550px',
      data: { disciplineId },
    });
  }

  public openEditDialog(discipline: IDiscipline): void {
    this.dialog.open(DisciplineEditDialogComponent, {
      width: '550px',
      data: { discipline, teachers: this.teachers },
    });
  }
}
