import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';

import { MarksApiService } from 'src/app/marks/services/marks-api.service';
import { StudentMarks } from '../../models/student-marks.model';

@Component({
  selector: 'app-marks-table',
  templateUrl: './marks-table.component.html',
  styleUrls: ['./marks-table.component.scss'],
})
export class MarksTableComponent implements OnInit {
  ELEMENT_DATA: StudentMarks[] = [];
  selectedDiscipline: any;
  disciplines: any[];
  filteredDisciplines: any[];
  columns: any[];
  displayedColumns: string[];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private api: MarksApiService,
  ) {}

  ngOnInit() {
    this.api.getDisciplines().then(res => {
      this.disciplines = res.result;
      const selectedDisciplineId = +this.route.snapshot.paramMap.get(
        'disciplineId',
      );
      this.selectedDiscipline = selectedDisciplineId
        ? this.disciplines.find(d => d.id === selectedDisciplineId)
        : this.disciplines[0];
      this.filteredDisciplines = this.disciplines;
      this.getMarks(this.selectedDiscipline.id);
    });
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  filterDisciplines(e): void {
    if (!this.disciplines) {
      return;
    }
    const search = e ? e.toLowerCase() : '';
    this.filteredDisciplines = this.disciplines.filter(
      discipline => discipline.disciplineValue.indexOf(search) !== -1,
    );
  }

  onSelectedDisciplineChange(): void {
    this.router.navigate([`/marks/${this.selectedDiscipline.id}`]);
    this.getMarks(this.selectedDiscipline.id);
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

  getMarks(disciplineId) {
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
        this.displayedColumns = [
          'studentName',
          ...this.columns.map((x, i) => x.columnDef(i)),
        ];
        this.dataSource.sort = this.sort;
      },
      err => {
        console.log(err);
      },
    );
  }
}
