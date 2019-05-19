import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs';

import { MarksApiService } from '../../services/marks-api.service';
import { StudentMarks } from '../../models/student-marks.model';
import { Marks } from '../../models/marks.model';
import { Jobs } from '../../models/jobs.model';
import { Student } from 'src/app/groups/models/student.model';
import { DialogService } from 'src/app/core/services/dialog.service';

@Component({
  selector: 'app-marks-edit',
  templateUrl: './marks-edit.component.html',
  styleUrls: ['./marks-edit.component.scss'],
})
export class MarksEditComponent implements OnInit {
  columns: any[];
  displayedColumns: string[];
  dataSource = new MatTableDataSource([]);
  @ViewChild(MatSort) sort: MatSort;

  private ELEMENT_DATA: StudentMarks[] = [];
  private selectedDisciplineId: number;

  private marks: Marks[];
  private jobs: Jobs[];
  private students: Student[];

  private deletedJobsIds: Set<number> = new Set();
  private oldMarksJSON: string[];
  private oldJobsJSON: string[];
  private addedJobsNumber = 0;

  private saved = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private api: MarksApiService,
    private dialogService: DialogService,
  ) {}

  ngOnInit() {
    this.selectedDisciplineId = +this.route.snapshot.paramMap.get(
      'disciplineId',
    );
    this.getMarks(this.selectedDisciplineId);
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  markChange(e: string, mark: Marks) {
    this.saved = false;
    this.marks.forEach((value, index) => {
      if (JSON.stringify(value) === JSON.stringify(mark)) {
        this.marks[index].markValue = e;
      }
    });
  }

  jobChange(e, jobNumber: number) {
    this.saved = false;
    this.jobs[jobNumber].jobValue = e;
  }

  save() {
    const newMarks = [];
    const addedMarks = [];
    this.marks.forEach((value, index) => {
      if (this.oldMarksJSON[index] !== JSON.stringify(value)) {
        newMarks.push(value);
      }
      if (value.id === null) {
        addedMarks.push(value);
      }
    });
    const newJobs = [];
    const addedJobs = [];
    this.jobs.forEach((value, index) => {
      if (this.oldJobsJSON[index] !== JSON.stringify(value)) {
        newJobs.push(value);
      }
      if (value.id < 0) {
        addedJobs.push(value);
      }
    });
    if (
      newMarks.length > 0 ||
      newJobs.length > 0 ||
      this.deletedJobsIds.size > 0 ||
      addedJobs.length > 0
    ) {
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
      this.router.navigate(['/marks']);
    } else {
      alert('no changes to save!');
    }
  }

  delete(e) {
    this.saved = false;
    this.deletedJobsIds.add(e);
  }

  add() {
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

  cancelDelete(e) {
    this.deletedJobsIds.delete(e);
  }

  cancelAdd(e) {
    const index = this.jobs.findIndex(v => v.id === e);
    this.jobs.splice(index, 1);
    const markIndexes = [];
    this.marks.forEach((value, i) => {
      if (value.jobId === e) {
        markIndexes.push(i);
      }
    });
    for (let i = markIndexes.length - 1; i >= 0; i--) {
      this.marks.splice(markIndexes[i], 1);
    }
    this.updateTableData({
      students: this.students,
      marks: this.marks,
      jobs: this.jobs,
    });
  }

  isDeleted(e): boolean {
    if (this.deletedJobsIds.has(e)) {
      return true;
    } else {
      return false;
    }
  }

  isAdded(row): boolean {
    if (row < 0) {
      return true;
    } else {
      return false;
    }
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
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
      },
    );
  }

  private updateMarks(newMarks: Marks[]) {
    this.api.updateMarks(newMarks).then(
      res => {
        console.log('marks were updated');
      },
      err => {
        console.log(err);
      },
    );
  }

  private updateJobs(newJobs: Jobs[]) {
    this.api.updateJobs(newJobs).then(
      res => {
        console.log('jobs were updated');
      },
      err => {
        console.log(err);
      },
    );
  }

  private addJobsAndMarks(addedJobs: Jobs[], addedMarks: Marks[]) {
    this.api.addJobsAndMarks(addedJobs, addedMarks).then(
      res => {
        console.log('jobs and marks were added');
      },
      err => {
        console.log(err);
      },
    );
  }

  private deleteJobsAndMarks() {
    this.api.deleteJobs(this.deletedJobsIds).then(
      res => {
        console.log('jobs and their marks were deleted');
      },
      err => {
        console.log(err);
      },
    );
  }

  private parseGetMarksResult(result): any[] {
    const marksAndStudents = result.students.map(student => {
      const studentMarks = result.marks.filter(
        mark => +mark.studentId === +student.id,
      );
      const markObject = {};
      studentMarks.forEach(mark => {
        const jobV = result.jobs.find(job => +mark.jobId === +job.id);
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

  private updateTableData(dataObj) {
    this.ELEMENT_DATA = this.parseGetMarksResult(dataObj);
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    this.dataSource.sort = this.sort;
    this.columns = this.jobs.map(row => {
      return {
        columnDef: index => `${row.jobValue}-${index}`,
        header: `${row.jobValue}`,
        cell: cellRow => `${cellRow[`${row.id}`].markValue}`,
        mark: cellRow => cellRow[`${row.id}`],
        jobId: row.id,
      };
    });
    this.displayedColumns = [
      'studentName',
      ...this.columns.map((x, i) => x.columnDef(i)),
    ];
  }
}
