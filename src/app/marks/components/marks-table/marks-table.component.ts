import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';

import { MarksApiService } from 'src/app/marks/services/marks-api.service';
import { StudentMarks } from '../../models/student-marks.model';
import { MarksDialogComponent } from '../marks-dialog/marks-dialog.component';
import { DialogData } from '../../models/dialog-data.model';

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
  marksAreas: DialogData = { three: 60, four: 75, five: 90 };

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private api: MarksApiService,
    public dialog: MatDialog,
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
          'sumPoints',
          'mark',
        ];
        this.dataSource.sort = this.sort;
      },
      err => {
        console.log(err);
      },
    );
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(MarksDialogComponent, {
      width: '300px',
      data: this.marksAreas,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.marksAreas = result;
    });
  }

  getSumPoints(element): number {
    let sumPoints = 0;
    let index = 1;
    let mark = element[1];
    while (mark !== undefined) {
      if (!isNaN(+mark.markValue)) {
        sumPoints += +mark.markValue;
      }
      if (mark.markValue === '+') {
        sumPoints += 10;
      }
      index++;
      mark = element[index];
    }
    return sumPoints;
  }

  getResultMark(element): string {
    const sumPoints = this.getSumPoints(element);
    if (sumPoints < this.marksAreas.three) {
      return 'неуд.';
    } else if (
      sumPoints > this.marksAreas.three &&
      sumPoints < this.marksAreas.four
    ) {
      return 'удовл.';
    } else if (
      sumPoints > this.marksAreas.four &&
      sumPoints < this.marksAreas.five
    ) {
      return 'хор.';
    } else if (sumPoints > this.marksAreas.five) {
      return 'отл.';
    }
  }
}
