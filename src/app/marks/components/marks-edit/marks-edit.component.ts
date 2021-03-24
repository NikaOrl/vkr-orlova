import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs';

import { MarksApiService } from '../../services/marks-api.service';
import { IStudentMark } from '../../models/student-marks.model';
import { IMark } from '../../models/marks.model';
import { IJob } from '../../models/jobs.model';
import { IStudent } from 'src/app/groups/models/student.model';
import { DialogService } from 'src/app/core/services/dialog.service';
import { IColumn } from '../../models/column.model';
import { ITableData } from '../../models/table-data.model';

@Component({
  selector: 'app-marks-edit',
  templateUrl: './marks-edit.component.html',
  styleUrls: ['./marks-edit.component.scss'],
})
export class MarksEditComponent implements OnInit {
  public columns: IColumn[];
  public displayedColumns: string[];
  public dataSource: MatTableDataSource<IStudentMark> = new MatTableDataSource([]);
  @ViewChild(MatSort) public sort: MatSort;
  public selectedDisciplineId: number;

  private ELEMENT_DATA: IStudentMark[] = [];

  private marks: IMark[];
  private jobs: IJob[];
  private students: IStudent[];

  private deletedJobsIds: Set<number> = new Set();
  private oldMarksJSON: string[];
  private oldJobsJSON: string[];
  private addedJobsNumber: number = 0;

  private saved: boolean = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private api: MarksApiService,
    private dialogService: DialogService
  ) {}

  public ngOnInit(): void {
    this.selectedDisciplineId = +this.route.snapshot.paramMap.get('disciplineId');
    this.getMarks(this.selectedDisciplineId);
  }

  public applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public markChange(e: string, mark: IMark): void {
    this.saved = false;
    this.marks.forEach((value, index) => {
      if (JSON.stringify(value) === JSON.stringify(mark)) {
        this.marks[index].markValue = e;
      }
    });
  }

  public jobChange(e: string, jobNumber: number): void {
    this.saved = false;
    this.jobs[jobNumber].jobValue = e;
  }

  public save(): void {
    const newMarks: IMark[] = [];
    const addedMarks: IMark[] = [];
    this.marks.forEach((value, index) => {
      if (this.oldMarksJSON[index] && this.oldMarksJSON[index] !== JSON.stringify(value)) {
        newMarks.push(value);
      }
      if (value.id === null) {
        addedMarks.push(value);
      }
    });
    const newJobs: IJob[] = [];
    const addedJobs: IJob[] = [];
    this.jobs.forEach((value, index) => {
      if (this.oldJobsJSON[index] && this.oldJobsJSON[index] !== JSON.stringify(value)) {
        newJobs.push(value);
      }
      if (value.id < 0) {
        addedJobs.push(value);
      }
    });
    if (newMarks.length > 0 || newJobs.length > 0 || this.deletedJobsIds.size > 0 || addedJobs.length > 0) {
      if (newMarks.length > 0) {
        this.updateMarks(newMarks);
      }
      if (newJobs.length > 0) {
        this.updateJobs(newJobs);
      }
      if (this.deletedJobsIds.size > 0) {
        this.deleteJobsAndMarks();
      }
      if (addedJobs.length > 0) {
        this.addJobsAndMarks(addedJobs, addedMarks);
      }
      this.saved = true;
      this.router.navigate([`/marks/${this.selectedDisciplineId}`]);
    } else {
      alert('no changes to save!');
    }
  }

  public delete(e: number): void {
    this.saved = false;
    this.deletedJobsIds.add(e);
  }

  public add(): void {
    this.saved = false;
    this.addedJobsNumber++;
    this.jobs.push({
      id: -this.addedJobsNumber,
      disciplineId: this.selectedDisciplineId,
      jobValue: `added-${this.addedJobsNumber}`,
      deleted: false,
    });
    this.students.forEach(student => {
      this.marks.push({
        id: null,
        studentId: student.id,
        jobId: -this.addedJobsNumber,
        markValue: '',
        deleted: false,
      });
    });
    this.updateTableData({
      students: this.students,
      marks: this.marks,
      jobs: this.jobs,
    });
  }

  public cancelDelete(e: number): void {
    this.deletedJobsIds.delete(e);
  }

  public cancelAdd(e: number): void {
    const index: number = this.jobs.findIndex(v => v.id === e);
    this.jobs.splice(index, 1);
    const markIndexes: number[] = [];
    this.marks.forEach((value, i) => {
      if (value.jobId === e) {
        markIndexes.push(i);
      }
    });
    for (let i: number = markIndexes.length - 1; i >= 0; i--) {
      this.marks.splice(markIndexes[i], 1);
    }
    this.updateTableData({
      students: this.students,
      marks: this.marks,
      jobs: this.jobs,
    });
  }

  public isDeleted(e: number): boolean {
    return this.deletedJobsIds.has(e);
  }

  public isAdded(row: number): boolean {
    return row < 0;
  }

  public canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.saved) {
      return true;
    }
    return this.dialogService.confirm('Discard changes?');
  }

  private getMarks(disciplineId: number): void {
    this.api.getMarks(disciplineId).then(
      res => {
        this.marks = [...res.marks];
        this.jobs = [...res.jobs];
        this.students = res.students;

        this.oldJobsJSON = this.jobs.map(value => JSON.stringify(value));
        this.oldMarksJSON = this.marks.map(value => JSON.stringify(value));
        this.updateTableData(res);
      },
      err => {
        console.log(err);
      }
    );
  }

  private updateMarks(newMarks: IMark[]): void {
    this.api.updateMarks(newMarks).then(
      res => {
        console.log('marks were updated');
      },
      err => {
        console.log(err);
      }
    );
  }

  private updateJobs(newJobs: IJob[]): void {
    this.api.updateJobs(newJobs).then(
      res => {
        console.log('jobs were updated');
      },
      err => {
        console.log(err);
      }
    );
  }

  private addJobsAndMarks(addedJobs: IJob[], addedMarks: IMark[]): void {
    this.api.addJobsAndMarks(addedJobs, addedMarks).then(
      res => {
        console.log('jobs and marks were added');
      },
      err => {
        console.log(err);
      }
    );
  }

  private deleteJobsAndMarks(): void {
    this.api.deleteJobs(this.deletedJobsIds).then(
      res => {
        console.log('jobs and their marks were deleted');
      },
      err => {
        console.log(err);
      }
    );
  }

  private parseGetMarksResult(result: ITableData): IStudentMark[] {
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

  private updateTableData(dataObj: ITableData): void {
    this.ELEMENT_DATA = this.parseGetMarksResult(dataObj);
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    this.dataSource.sort = this.sort;
    this.columns = this.jobs.map(row => {
      return {
        columnDef: index => `${row.jobValue}-${index}`,
        header: `${row.jobValue}`,
        cell: (cellRow, studentIndex) => {
          const jobId: number = row.id;
          const jsonMarks: string[] = this.marks.map(mark => JSON.stringify(mark));
          const newMark: IMark = {
            id: null,
            studentId: this.students[studentIndex].id,
            jobId,
            markValue: '',
            deleted: false,
          };
          if (cellRow[`${row.id}`] === undefined) {
            if (jsonMarks.indexOf(JSON.stringify(newMark)) === -1) {
              this.marks.push(newMark);
              this.oldMarksJSON.push('undefined');
              this.updateTableData({
                students: this.students,
                marks: this.marks,
                jobs: this.jobs,
              });
            }
            return '';
          }
          return `${cellRow[`${row.id}`].markValue}`;
        },
        mark: cellRow => cellRow[`${row.id}`],
        jobId: row.id,
      };
    });
    this.displayedColumns = ['studentName', ...this.columns.map((x, i) => x.columnDef(i))];
  }
}
