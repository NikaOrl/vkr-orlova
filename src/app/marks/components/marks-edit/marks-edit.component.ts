import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { MarksApiService } from '../../services/marks-api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-marks-edit',
  templateUrl: './marks-edit.component.html',
  styleUrls: ['./marks-edit.component.scss'],
})
export class MarksEditComponent implements OnInit {
  ELEMENT_DATA: any[] = [];
  selectedDisciplineId: number;
  columns: any[];
  displayedColumns: string[];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);

  constructor(private route: ActivatedRoute, private api: MarksApiService) {}

  ngOnInit() {
    this.selectedDisciplineId = +this.route.snapshot.paramMap.get(
      'disciplineId',
    );
    this.getMarks(this.selectedDisciplineId);
  }

  parseGetMarksResult(result): any[] {
    const marksAndStudents = result.students.map(student => {
      const studentMarks = result.marks.filter(mark => {
        return +mark.studentId === +student.id;
      });
      const markObject = {};
      studentMarks.forEach(mark => {
        const jobValue = result.jobs.find(job => +mark.jobId === +job.id)
          .jobValue;
        markObject[jobValue] = `${mark.markValue}`;
      });
      return {
        studentName: `${student.firstName} ${student.lastName}`,
        ...markObject,
      };
    });
    return marksAndStudents;
  }

  getMarks(disciplineId) {
    this.api.getMarks(disciplineId).then(
      res => {
        this.ELEMENT_DATA = this.parseGetMarksResult(res);
        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
        this.columns = res.jobs
          .map(job => job.jobValue)
          .map(row => {
            return {
              columnDef: `${row}`,
              header: `${row}`,
              cell: cellRow => `${cellRow[`${row}`]}`,
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
}
