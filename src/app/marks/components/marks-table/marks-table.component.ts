import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { MarksApiService } from 'src/app/marks/services/marks-api.service';

@Component({
  selector: 'app-marks-table',
  templateUrl: './marks-table.component.html',
  styleUrls: ['./marks-table.component.scss'],
})
export class MarksTableComponent implements OnInit {
  ELEMENT_DATA: any[] = [];

  selectedDiscipline: any;
  disciplines: any[];
  filteredDisciplines: any[];

  columns: any[];
  displayedColumns: string[];

  dataSource = new MatTableDataSource(this.ELEMENT_DATA);

  @ViewChild(MatSort) sort: MatSort;

  constructor(private api: MarksApiService) {}

  ngOnInit() {
    this.api.getDisciplines().then(res => {
      this.disciplines = res.result;
      this.selectedDiscipline = this.disciplines[0];
      this.filteredDisciplines = this.disciplines;
      this.getMarks(this.selectedDiscipline.id);
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  filterDisciplines(e) {
    if (!this.disciplines) {
      return;
    }
    const search = e ? e.toLowerCase() : '';
    this.filteredDisciplines = this.disciplines.filter(
      discipline => discipline.disciplineValue.indexOf(search) !== -1,
    );
  }

  onSelectedDisciplineChange() {
    this.getMarks(this.selectedDiscipline.id);
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
        this.dataSource.sort = this.sort;
      },
      err => {
        console.log(err);
      },
    );
  }
}
