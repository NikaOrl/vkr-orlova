import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { ITeacher } from '../../../teachers/models/teacher.model';
import { IDiscipline } from '../../models/discipline.model';
import { DisciplinesApiService } from '../../services/disciplines-api.service';
import { DisciplineDialogComponent } from '../discipline-dialog/discipline-dialog.component';

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

  public getTeacher(teacherId: number): ITeacher {
    return this.teachers.find((teacher: ITeacher) => teacher.id === teacherId);
  }

  public openDialog(disciplineId: number): void {
    this.dialog.open(DisciplineDialogComponent, {
      width: '300px',
      data: { disciplineId },
    });
  }
}
