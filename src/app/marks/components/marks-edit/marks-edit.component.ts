import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

import { MarksApiService } from '../../services/marks-api.service';
import { StudentMarks } from '../../models/student-marks.model';
import { Marks } from '../../models/marks.model';
import { Jobs } from '../../models/jobs.model';

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
  deletedJobsIds: Set<number> = new Set();
  oldMarksJSON: string[];
  oldJobsJSON: string[];

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
        this.ELEMENT_DATA = this.parseGetMarksResult(res);
        this.marks = res.marks;
        this.jobs = res.jobs;
        this.oldJobsJSON = this.jobs.map(value => JSON.stringify(value));
        this.oldMarksJSON = this.marks.map(value => JSON.stringify(value));
        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
        this.columns = res.jobs.map(row => {
          return {
            columnDef: `${row.jobValue}`,
            header: `${row.jobValue}`,
            cell: cellRow => `${cellRow[`${row.id}`].markValue}`,
            markId: cellRow => `${cellRow[`${row.id}`].id}`,
            jobId: row.id,
          };
        });
        this.displayedColumns = [
          'studentName',
          ...this.columns.map(x => x.columnDef),
        ];
      },
      err => {
        console.log(err);
      },
    );
  }

  markChange(e: string, markId: number) {
    this.marks.forEach((value, index) => {
      if (+value.id === +markId) {
        this.marks[index].markValue = e;
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

  // addJobs(addedJobs: Jobs[]) {
  //   this.api.addJobs(addedJobs).then(
  //     res => {
  //       console.log('jobs were added');
  //     },
  //     err => {
  //       console.log(err);
  //     },
  //   );
  //   // get added marks
  //   const addedMarks = [];
  //   this.api.addMarks(addedMarks).then(
  //     res => {
  //       console.log('marks were added');
  //     },
  //     err => {
  //       console.log(err);
  //     },
  //   );
  // }

  deleteJobs() {
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
    if (
      newMarks.length > 0 ||
      newJobs.length > 0 ||
      this.deletedJobsIds.size > 0
    ) {
      if (newMarks.length > 0) {
        this.updateMarks(newMarks);
      }
      if (newJobs.length > 0) {
        this.updateJobs(newJobs);
      }
      if (this.deletedJobsIds.size > 0) {
        this.deleteJobs();
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
    // if (row.id === null) {
    //   return true;
    // } else {
    //   return false;
    // }
    return false;
  }

  delete(e) {
    this.deletedJobsIds.add(e);
  }

  // add() {
  //   this.jobs.push({
  //     id: null,
  //     disciplineId: this.selectedDisciplineId,
  //     jobValue: '',
  //     deleted: false,
  //   });
  //   this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  // }

  cancelDelete(e) {
    this.deletedJobsIds.delete(e);
  }

  // cancelAdd(e) {
  //   const index = this.ELEMENT_DATA.findIndex(
  //     v => JSON.stringify(v) === JSON.stringify(e),
  //   );
  //   this.ELEMENT_DATA.splice(index, 1);
  //   this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  // }
}
