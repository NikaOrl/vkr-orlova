import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

import { MarksApiService } from '../../services/marks-api.service';
import { StudentMarks } from '../../models/student-marks.model';

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

  marks: any[];
  jobs: any[];
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

  save() {
    const newMarks = [];
    let navigateFlag = false;
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
    if (newMarks.length > 0 || newJobs.length > 0) {
      if (newMarks.length > 0) {
        this.api.updateMarks(newMarks).then(
          res => {
            console.log('marks were updated');
            if (navigateFlag || newJobs.length === 0) {
              this.router.navigate(['/marks']);
            } else {
              navigateFlag = true;
            }
          },
          err => {
            console.log(err);
          },
        );
      }
      if (newJobs.length > 0) {
        this.api.updateJobs(newJobs).then(
          res => {
            console.log('jobs were updated');
            if (navigateFlag || newMarks.length === 0) {
              this.router.navigate(['/marks']);
            } else {
              navigateFlag = true;
            }
          },
          err => {
            console.log(err);
          },
        );
      }
    } else {
      alert('no changes to save!');
    }
  }
}
