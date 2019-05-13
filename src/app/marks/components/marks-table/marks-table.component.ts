import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { MarksApiService } from 'src/app/marks/services/marks-api.service';

export interface PeriodicElement {
  studentName: string;
  '01.01': string;
  '01.02': string;
}

// example of data from back
export const marksAndstudentName = [
  {
    studentName: 'Ivan',
    '01.01': '5',
    '01.02': '2'
  },
  {
    studentName: 'Petr',
    '01.01': '4',
    '01.02': '3'
  },
  {
    studentName: 'Vasia',
    '01.01': '4',
    '01.02': '3'
  },
  {
    studentName: 'Sergei',
    '01.01': '4',
    '01.02': 'н/з'
  }
];

const marksKeys = ['01.01', '01.02'];

@Component({
  selector: 'app-marks-table',
  templateUrl: './marks-table.component.html',
  styleUrls: ['./marks-table.component.scss']
})
export class MarksTableComponent implements OnInit {
  ELEMENT_DATA: PeriodicElement[] = [];

  selectedGroup: string;
  groups: string[];
  filteredGroups: string[];

  selectedDiscipline: string;
  disciplines: string[];
  filteredDisciplines: string[];

  columns = marksKeys.map(row => {
    return {
      columnDef: `${row}`,
      header: `${row}`,
      cell: cellRow => `${cellRow[`${row}`]}`
    };
  });
  displayedColumns: string[];

  dataSource = new MatTableDataSource(this.ELEMENT_DATA);

  @ViewChild(MatSort) sort: MatSort;

  constructor(private api: MarksApiService) {}

  ngOnInit() {
    this.api.getMarksPageStartedData().subscribe(
      res => {
        console.log(res);

        this.groups = res.groups;
        this.selectedGroup = this.groups[0];
        this.filteredGroups = this.groups;

        this.disciplines = res.disciplines;
        this.selectedDiscipline = this.disciplines[0];
        this.filteredDisciplines = this.disciplines;

        this.ELEMENT_DATA = res.marks;
        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
        this.dataSource.sort = this.sort;
      },
      err => {
        console.log(err);
      }
    );

    this.displayedColumns = [
      'studentName',
      ...this.columns.map(x => x.columnDef)
    ];
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  filterGroups(e) {
    if (!this.groups) {
      return;
    }
    const search = e ? e.toLowerCase() : '';
    this.filteredGroups = this.groups.filter(
      group => group.indexOf(search) !== -1
    );
  }

  filterDisciplines(e) {
    if (!this.disciplines) {
      return;
    }
    const search = e ? e.toLowerCase() : '';
    this.filteredDisciplines = this.disciplines.filter(
      discipline => discipline.indexOf(search) !== -1
    );
  }

  onSelectedGroupChange() {
    this.api
      .getDisciplinesByGroup(this.selectedGroup)
      .then(
        res => {
          console.log(res);
          this.disciplines = res;
          if (this.disciplines.indexOf(this.selectedDiscipline) === -1) {
            this.selectedDiscipline = this.disciplines[0];
          }
        },
        err => {
          console.log(err);
        }
      )
      .then(() => {
        this.getMarks();
      });
  }

  getMarks() {
    this.api.getMarks(this.selectedGroup, this.selectedDiscipline).then(
      res => {
        console.log(res);
        this.ELEMENT_DATA = res;
        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
      },
      err => {
        console.log(err);
      }
    );
  }
}
