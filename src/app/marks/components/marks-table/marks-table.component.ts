import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { MarksApiService } from '../../services/marks-api.service';
import { IStudentMark } from '../../models/student-marks.model';
import { MarksDialogComponent } from '../marks-dialog/marks-dialog.component';
import { IDialogData } from '../../models/dialog-data.model';
import { IColumn } from '../../models/column.model';
import { IDiscipline } from '../../models/discipline.model';
import { ITableData } from '../../models/table-data.model';
import { IMark } from '../../models/marks.model';
import { IJob } from '../../models/jobs.model';

@Component({
  selector: 'app-marks-table',
  templateUrl: './marks-table.component.html',
  styleUrls: ['./marks-table.component.scss'],
})
export class MarksTableComponent implements OnInit {
  public ELEMENT_DATA: IStudentMark[] = [];
  public selectedDiscipline: IDiscipline;
  public disciplines: IDiscipline[];
  public filteredDisciplines: IDiscipline[];
  public columns: IColumn[];
  public displayedColumns: string[];
  public dataSource: MatTableDataSource<IStudentMark> = new MatTableDataSource(this.ELEMENT_DATA);
  public marksAreas: IDialogData = { three: 60, four: 75, five: 90 };

  @ViewChild(MatSort) public sort: MatSort;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private api: MarksApiService,
    public dialog: MatDialog
  ) {}

  public ngOnInit(): void {
    this.api.getDisciplines().then(res => {
      this.disciplines = res.result;
      const selectedDisciplineId: number = +this.route.snapshot.paramMap.get('disciplineId');
      this.selectedDiscipline = selectedDisciplineId
        ? this.disciplines.find(d => d.id === selectedDisciplineId)
        : this.disciplines[0];
      this.filteredDisciplines = this.disciplines;
      this.getMarks(this.selectedDiscipline.id);
    });
  }

  public applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public filterDisciplines(e: string): void {
    if (!this.disciplines) {
      return;
    }
    const search: string = e ? e.toLowerCase() : '';
    this.filteredDisciplines = this.disciplines.filter(discipline => discipline.disciplineValue.indexOf(search) !== -1);
  }

  public onSelectedDisciplineChange(): void {
    this.router.navigate([`/marks/${this.selectedDiscipline.id}`]);
    this.getMarks(this.selectedDiscipline.id);
  }

  public parseGetMarksResult(result: ITableData): IStudentMark[] {
    const marksAndStudents: IStudentMark[] = result.students.map(student => {
      const studentMarks: IMark[] = result.marks.filter(mark => +mark.studentId === +student.id);
      const markObject: { [key: number]: IMark } = {};
      studentMarks.forEach(mark => {
        const jobV: IJob = result.jobs.find(job => +mark.jobId === +job.id);
        if (jobV) {
          markObject[jobV.id] = mark;
        }
      });
      return {
        studentName: `${student.firstName} ${student.lastName}`,
        ...markObject,
      };
    });
    return marksAndStudents;
  }

  public getMarks(disciplineId: number): void {
    this.api.getMarks(disciplineId).then(
      res => {
        this.ELEMENT_DATA = this.parseGetMarksResult(res);
        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
        this.columns = res.jobs.map(row => {
          return {
            columnDef: index => `${row.jobValue}-${index}`,
            header: `${row.jobValue}`,
            cell: cellRow => {
              if (cellRow[`${row.id}`] === undefined) {
                return '';
              }
              return `${cellRow[`${row.id}`].markValue}`;
            },
          };
        });
        this.displayedColumns = ['studentName', ...this.columns.map((x, i) => x.columnDef(i)), 'sumPoints', 'mark'];
        this.dataSource.sort = this.sort;
      },
      err => {
        console.log(err);
      }
    );
  }

  public openDialog(): void {
    // tslint:disable-next-line: no-any
    const dialogRef: MatDialogRef<MarksDialogComponent, any> = this.dialog.open(MarksDialogComponent, {
      width: '300px',
      data: this.marksAreas,
    });

    // tslint:disable-next-line: deprecation
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.marksAreas = result;
    });
  }

  public getSumPoints(element: IMark[]): number {
    let sumPoints: number = 0;
    let index: number = 1;
    let mark: IMark = element[1];
    while (mark !== undefined) {
      if (!isNaN(+mark.markValue)) {
        sumPoints += +mark.markValue;
      }
      if (mark.markValue === '+') {
        sumPoints += 10;
      }
      index++;
      mark = element[index];
    }
    return sumPoints;
  }

  public getResultMark(element: IMark[]): string {
    const sumPoints: number = this.getSumPoints(element);
    if (sumPoints < this.marksAreas.three) {
      return 'неуд.';
    } else if (sumPoints > this.marksAreas.three && sumPoints < this.marksAreas.four) {
      return 'удовл.';
    } else if (sumPoints > this.marksAreas.four && sumPoints < this.marksAreas.five) {
      return 'хор.';
    } else if (sumPoints > this.marksAreas.five) {
      return 'отл.';
    }
  }
}
