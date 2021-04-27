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
import { ITableData } from '../../models/table-data.model';
import { IMark } from '../../models/marks.model';
import { IJob } from '../../models/jobs.model';
import { IGroup } from '../../../groups/models/group.model';
import { IDiscipline } from '../../../disciplines/models/discipline.model';

@Component({
  selector: 'app-marks-table',
  templateUrl: './marks-table.component.html',
  styleUrls: ['./marks-table.component.scss'],
})
export class MarksTableComponent implements OnInit {
  public ELEMENT_DATA: IStudentMark[] = [];

  public selectedGroup: IGroup;
  public groups: IGroup[];
  public filteredGroups: IGroup[];
  public groupSelectValue: string | IGroup;

  public columns: IColumn[];
  public maxPointFuilds: IColumn[];

  public displayedColumns: string[];
  public displayedMaxPointColumns: string[];

  public dataSource: MatTableDataSource<IStudentMark> = new MatTableDataSource(this.ELEMENT_DATA);
  public marksAreas: IDialogData = { three: 60, four: 75, five: 90 };

  public editLink: string = '';
  public selectedDisciplineId: number;

  @ViewChild(MatSort) public sort: MatSort;

  private jobs: IJob[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private api: MarksApiService,
    public dialog: MatDialog
  ) {}

  public ngOnInit(): void {
    this.selectedDisciplineId = +this.route.snapshot.paramMap.get('disciplineId');
    if (!this.selectedDisciplineId) {
      this.api.getDisciplines().subscribe(disciplines => {
        this.selectedDisciplineId = disciplines[0].id;
        this.onSelectChange();
      });
    }

    this.api.getGroups().subscribe(groups => {
      this.groups = groups;
      const selectedGroupId: number = +this.route.snapshot.paramMap.get('groupId');
      this.selectedGroup = selectedGroupId ? this.groups.find(d => d.id === selectedGroupId) : this.groups[0];
      this.filteredGroups = this.groups;
      this.groupSelectValue = this.selectedGroup?.groupNumber ? this.selectedGroup.groupNumber.toString() : '';
      this.getMarks();
    });
  }

  public applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public selectGroup(group: IGroup): void {
    this.selectedGroup = group;
    this.onSelectChange();
  }

  public displayGroupFn(group: IGroup | string): string {
    if (group) {
      return (group as IGroup).groupNumber ? (group as IGroup).groupNumber.toString() : (group as string);
    }
    return '';
  }

  public onSelectChange(): void {
    this.router.navigate([`/marks/${this.selectedDisciplineId}/${this.selectedGroup.id}`]);
    this.getMarks();
  }

  public parseGetMarksResult(result: ITableData): IStudentMark[] {
    const marksAndStudents: IStudentMark[] = result.students.map(student => {
      const studentMarks: IMark[] = result.marks.filter(mark => +mark.studentId === +student.id);
      const markObject: { [key: number]: IMark } = {};
      studentMarks.forEach(mark => {
        const jobIndex: number = result.jobs.findIndex(job => +mark.jobId === +job.id);
        markObject[jobIndex] = mark;
      });
      return {
        studentName: `${student.firstName} ${student.lastName}`,
        ...markObject,
      };
    });
    return marksAndStudents;
  }

  public getMarks(): void {
    if (this.selectedDisciplineId && this.selectedGroup) {
      this.editLink = `/marks/edit/${this.selectedDisciplineId}/${this.selectedGroup.id}`;

      this.api.getMarks(this.selectedDisciplineId, this.selectedGroup.id).then(
        res => {
          this.ELEMENT_DATA = this.parseGetMarksResult(res);
          this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
          this.jobs = res.jobs;
          this.maxPointFuilds = this.jobs.map(row => {
            return {
              columnDef: index => `maxPoint-${index}`,
              header: `${row.maxPoint}`,
              cell: () => null,
            };
          });

          this.columns = this.jobs.map((row, index) => {
            return {
              columnDef: columnIndex => `${row.jobValue}-${columnIndex}`,
              header: `${row.jobValue}`,
              cell: cellRow => {
                if (!cellRow[index] || !cellRow[index].markValue) {
                  return '';
                }
                return `${cellRow[index].markValue}`;
              },
            };
          });
          this.displayedColumns = ['studentName', ...this.columns.map((x, i) => x.columnDef(i)), 'sumPoints', 'mark'];
          this.displayedMaxPointColumns = [
            'maxPointFuild',
            ...this.maxPointFuilds.map((x, i) => x.columnDef(i)),
            'maxPointsSum',
            'maxPointsResult',
          ];

          this.dataSource.sort = this.sort;
        },
        err => {
          console.log(err);
        }
      );
    }
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
      if (result) {
        this.marksAreas = result;
      }
    });
  }

  public getSumPoints(element: IMark[]): number {
    let sumPoints: number = 0;
    let index: number = 0;
    let mark: IMark = element[index];
    while (mark !== undefined) {
      if (!isNaN(+mark.markValue)) {
        sumPoints += +mark.markValue;
      }
      if (mark.markValue === '+') {
        sumPoints += 1;
      }
      index++;
      mark = element[index];
    }
    return sumPoints;
  }

  public getSumMaxPoints(): number {
    let sumPoints: number = 0;
    this.jobs.forEach((job: IJob) => {
      sumPoints += job.maxPoint;
    });
    return sumPoints;
  }

  public getResultCellMark(element: IMark[]): string {
    const sumPoints: number = this.getSumPoints(element);
    return this.getResultMark(sumPoints);
  }

  public getResultMaxMark(): string {
    const sumPoints: number = this.getSumMaxPoints();
    return this.getResultMark(sumPoints);
  }

  public getResultMark(sumPoints: number): string {
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

  public filterGroups(): void {
    const filterValue: string = this.displayGroupFn(this.groupSelectValue);
    this.filteredGroups = this.groups.filter(
      option => `${option.groupNumber}`.toLowerCase().indexOf(filterValue) === 0
    );
    this.groupSelectValue = filterValue;
  }
}
