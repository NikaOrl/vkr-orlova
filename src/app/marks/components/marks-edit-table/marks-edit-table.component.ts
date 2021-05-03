import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import { MarksApiService } from '../../services/marks-api.service';
import { IStudentMark } from '../../models/student-marks.model';
import { IMark } from '../../models/mark.model';
import { IJob } from '../../models/job.model';
import { IStudent } from 'src/app/groups/models/student.model';
import { IColumn } from '../../models/column.model';
import { ITableData, ITableDataJob } from '../../models/table-data.model';

@Component({
  selector: 'app-marks-edit-table',
  templateUrl: './marks-edit-table.component.html',
  styleUrls: ['./marks-edit-table.component.scss'],
})
export class MarksEditTableComponent implements OnInit {
  @Input() public selectedGroupId: string;
  @Input() public selectedDisciplineId: string;
  @Output() public setSaved: EventEmitter<boolean> = new EventEmitter<boolean>();

  public columns: IColumn[];
  public maxPointFuilds: IColumn[];

  public displayedColumns: string[];
  public displayedMaxPointColumns: string[];

  public dataSource: MatTableDataSource<IStudentMark> = new MatTableDataSource([]);
  @ViewChild(MatSort) public sort: MatSort;

  private ELEMENT_DATA: IStudentMark[] = [];

  private jobs: ITableDataJob[];
  private students: IStudent[];

  private addedJobsNumber: number = 0;

  constructor(private router: Router, private api: MarksApiService) {}

  public ngOnInit(): void {
    this.getMarks();
  }

  set saved(value: boolean) {
    this.setSaved.emit(value);
  }

  public applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public markChange(e: string, jobId: string, ind: number): void {
    this.saved = false;
    this.jobs = this.jobs.map(a => ({
      ...a,
      marks: a.marks.map((mark, index) =>
        ind === index && mark.jobId === jobId ? { ...mark, attendanceMarkValue: e } : mark
      ),
    }));

    this.updateTableData({
      students: this.students,
      jobs: this.jobs,
    });
  }

  public jobChange(e: string, jobNumber: number): void {
    this.saved = false;
    this.jobs[jobNumber].jobValue = e;
  }

  public maxPointChange(e: number, jobNumber: number): void {
    this.saved = false;
    this.jobs[jobNumber].maxPoint = e;
  }

  public save(): void {
    if (!this.saved) {
      this.api.updateJobs(this.jobs).subscribe(res => {
        this.saved = true;
        if (document.activeElement.id === 'redirect-button') {
          this.router.navigate([`/marks/${this.selectedGroupId}/${this.selectedDisciplineId}`]);
        }
      });
    } else {
      alert('no changes to save!');
    }
  }

  public delete(e: string): void {
    this.saved = false;
    this.jobs[this.jobs.findIndex(job => job.id === e)].deleted = true;

    this.updateTableData({
      students: this.students,
      jobs: this.jobs,
    });
  }

  public add(): void {
    this.saved = false;
    this.addedJobsNumber++;
    this.jobs.push({
      id: `${-this.addedJobsNumber}`,
      disciplineId: this.selectedDisciplineId,
      jobValue: `added-${this.addedJobsNumber}`,
      deleted: false,
      numberInList: 0,
      moduleId: 'TODO',
      maxPoint: 0,
      marks: [
        ...this.students.map(student => ({
          id: null,
          studentId: student.id,
          jobId: `${-this.addedJobsNumber}`,
          markValue: '',
          deleted: false,
        })),
      ],
    });

    this.updateTableData({
      students: this.students,
      jobs: this.jobs,
    });
  }

  public cancelDelete(e: string): void {
    this.jobs[this.jobs.findIndex(job => job.id === e)].deleted = false;

    this.updateTableData({
      students: this.students,
      jobs: this.jobs,
    });
  }

  public cancelAdd(e: string): void {
    const index: number = this.jobs.findIndex(v => v.id === e);
    this.jobs.splice(index, 1);

    this.updateTableData({
      students: this.students,
      jobs: this.jobs,
    });
  }

  public isDeleted(e: string): boolean {
    return this.jobs[this.jobs.findIndex(job => job && job.id === e)].deleted;
  }

  public isAdded(e: string): boolean {
    return +this.jobs[this.jobs.findIndex(job => job && job.id === e)].id < 0;
  }

  public getMaxPoint(jobId: string): number {
    return this.jobs.find(job => job.id === jobId).maxPoint;
  }

  private getMarks(): void {
    this.api.getMarks(this.selectedDisciplineId, this.selectedGroupId).subscribe(
      res => {
        this.jobs = [...res.jobs];
        this.students = res.students;
        this.updateTableData(res);
      },
      err => {
        console.log(err);
      }
    );
  }

  private parseGetMarksResult(result: ITableData): IStudentMark[] {
    const marksAndStudents: IStudentMark[] = result.students.map(student => {
      const studentMarks: IMark[] = result.jobs.map(job => job.marks.find(mark => mark.studentId === student.id));
      const markObject: { [key: number]: IMark } = {};
      studentMarks.forEach(mark => {
        const jobV: IJob = result.jobs.find(job => mark && mark.jobId === job.id);
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

  private updateTableData(dataObj: ITableData): void {
    this.ELEMENT_DATA = this.parseGetMarksResult(dataObj);
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    this.dataSource.sort = this.sort;
    this.columns = this.jobs.map((row, index) => {
      return {
        columnDef: i => `${row.jobValue}-${i}`,
        header: `${row.jobValue}`,
        cell: (cellRow, jobId) => {
          return cellRow[jobId] && cellRow[jobId].markValue;
        },
        mark: cellRow => cellRow[`${row.id}`],
        jobId: row.id,
      };
    });
    this.maxPointFuilds = this.jobs.map(row => {
      return {
        columnDef: index => `maxPoint-${index}`,
        header: `${row.maxPoint}`,
        cell: () => {
          return null;
        },
        jobId: row.id,
      };
    });
    this.displayedColumns = ['studentName', ...this.columns.map((x, i) => x.columnDef(i))];
    this.displayedMaxPointColumns = ['maxPointHeader', ...this.maxPointFuilds.map((x, i) => x.columnDef(i))];
  }
}
