import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

import { MarksApiService } from '../../services/marks-api.service';
import { StudentMarks } from '../../models/student-marks.model';
import { Marks } from '../../models/marks.model';
import { Jobs } from '../../models/jobs.model';
import { Student } from 'src/app/groups/models/student.model';

@Component({
  selector: 'app-marks-edit',
  templateUrl: './marks-edit.component.html',
  styleUrls: ['./marks-edit.component.scss'],
})
export class MarksEditComponent implements OnInit {
  ELEMENT_DATA: StudentMarks[] = [];
  selectedDisciplineId: number;
  columns: any[];
  displayedColumns: string[];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);

  marks: Marks[];
  jobs: Jobs[];
  students: Student[];

  marksWithAdded: Marks[];
  jobsWithAdded: Jobs[];
  deletedJobsIds: Set<number> = new Set();
  oldMarksJSON: string[];
  oldJobsJSON: string[];
  addedJobsNumber = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private api: MarksApiService,
  ) {}

  ngOnInit() {
    this.selectedDisciplineId = +this.route.snapshot.paramMap.get(
      'disciplineId',
    );
    this.getMarks(this.selectedDisciplineId);
  }

  parseGetMarksResult(result): any[] {
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

  getMarks(disciplineId: number): void {
    this.api.getMarks(disciplineId).then(
      res => {
        this.marks = [...res.marks];
        this.jobs = [...res.jobs];

        this.students = res.students;
        this.marksWithAdded = [...res.marks];
        this.jobsWithAdded = [...res.jobs];

        this.oldJobsJSON = this.jobs.map(value => JSON.stringify(value));
        this.oldMarksJSON = this.marks.map(value => JSON.stringify(value));
        this.updateTableData(res);
      },
      err => {
        console.log(err);
      },
    );
  }

  markChange(e: string, mark: Marks) {
    this.marks.forEach((value, index) => {
      if (+value.id === +mark.id) {
        this.marks[index].markValue = e;
      }
    });
    this.marksWithAdded.forEach((value, index) => {
      if (JSON.stringify(value) === JSON.stringify(mark)) {
        this.marksWithAdded[index].markValue = e;
      }
    });
  }

  jobChange(e, jobNumber: number) {
    this.jobs[jobNumber].jobValue = e;
  }

  updateMarks(newMarks: Marks[]) {
    this.api.updateMarks(newMarks).then(
      res => {
        console.log('marks were updated');
      },
      err => {
        console.log(err);
      },
    );
  }

  updateJobs(newJobs: Jobs[]) {
    this.api.updateJobs(newJobs).then(
      res => {
        console.log('jobs were updated');
      },
      err => {
        console.log(err);
      },
    );
  }

  addJobsAndMarks(addedJobs: Jobs[], addedMarks: Marks[]) {
    this.api.addJobsAndMarks(addedJobs, addedMarks).then(
      res => {
        console.log('jobs and marks were added');
      },
      err => {
        console.log(err);
      },
    );
  }

  deleteJobsAndMarks() {
    this.api.deleteJobs(this.deletedJobsIds).then(
      res => {
        console.log('jobs ands their marks were deleted');
      },
      err => {
        console.log(err);
      },
    );
  }

  save() {
    const newMarks = [];
    this.marks.forEach((value, index) => {
      if (this.oldMarksJSON[index] !== JSON.stringify(value)) {
        newMarks.push(value);
      }
    });
    const newJobs = [];
    this.jobs.forEach((value, index) => {
      if (this.oldJobsJSON[index] !== JSON.stringify(value)) {
        newJobs.push(value);
      }
    });

    const addedJobs = [];
    this.jobsWithAdded.forEach(value => {
      if (value.id < 0) {
        addedJobs.push(value);
      }
    });
    const addedMarks = [];
    this.marksWithAdded.forEach(value => {
      if (value.id === null) {
        addedMarks.push(value);
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
      this.router.navigate(['/marks']);
    } else {
      alert('no changes to save!');
    }
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

  delete(e) {
    this.deletedJobsIds.add(e);
  }

  add() {
    this.addedJobsNumber++;
    this.jobsWithAdded.push({
      id: -this.addedJobsNumber,
      disciplineId: this.selectedDisciplineId,
      jobValue: `${this.addedJobsNumber}`,
      deleted: false,
    });
    this.students.forEach(student => {
      this.marksWithAdded.push({
        id: null,
        studentId: student.id,
        jobId: -this.addedJobsNumber,
        markValue: '',
        deleted: false,
      });
    });
    this.updateTableData({
      students: this.students,
      marks: this.marksWithAdded,
      jobs: this.jobsWithAdded,
    });
  }

  cancelDelete(e) {
    this.deletedJobsIds.delete(e);
  }

  cancelAdd(e) {
    const index = this.jobsWithAdded.findIndex(v => v.id === e);
    this.jobsWithAdded.splice(index, 1);
    const markIndexes = [];
    this.marksWithAdded.forEach((value, i) => {
      if (value.jobId === e) {
        markIndexes.push(i);
      }
    });
    for (let i = markIndexes.length - 1; i >= 0; i--) {
      this.marksWithAdded.splice(markIndexes[i], 1);
    }
    this.updateTableData({
      students: this.students,
      marks: this.marksWithAdded,
      jobs: this.jobsWithAdded,
    });
  }

  private updateTableData(dataObj) {
    this.ELEMENT_DATA = this.parseGetMarksResult(dataObj);
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    this.columns = this.jobsWithAdded.map(row => {
      return {
        columnDef: `${row.jobValue}`,
        header: `${row.jobValue}`,
        cell: cellRow => `${cellRow[`${row.id}`].markValue}`,
        mark: cellRow => cellRow[`${row.id}`],
        jobId: row.id,
      };
    });
    this.displayedColumns = [
      'studentName',
      ...this.columns.map(x => x.columnDef),
    ];
  }
}
