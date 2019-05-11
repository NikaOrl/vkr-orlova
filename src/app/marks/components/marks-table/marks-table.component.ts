import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { MarksApiService } from 'src/app/marks/services/api.service';

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
    '01.02': '2',
  },
  {
    studentName: 'Petr',
    '01.01': '4',
    '01.02': '3',
  },
  {
    studentName: 'Vasia',
    '01.01': '4',
    '01.02': '3',
  },
  {
    studentName: 'Sergei',
    '01.01': '4',
    '01.02': 'н/з',
  },
];

const marksKeys = ['01.01', '01.02'];

@Component({
  selector: 'app-marks-table',
  templateUrl: './marks-table.component.html',
  styleUrls: ['./marks-table.component.scss'],
})
export class MarksTableComponent implements OnInit {
  ELEMENT_DATA: PeriodicElement[] = [];

  selectedGroup: string;
  groups = ['5381', '5382', '5383', '3462', '5281', '5678', '3451'];
  filteredGroups: string[];

  selectedDiscipline: string;
  disciplines = ['oop', 'abc', 'one more discipline'];
  filteredDisciplines: string[];

  constructor(private api: MarksApiService) {}

  displayedColumns: string[];

  columns = marksKeys.map(row => {
    return {
      columnDef: `${row}`,
      header: `${row}`,
      cell: cellRow => `${cellRow[`${row}`]}`,
    };
  });

  dataSource = new MatTableDataSource(this.ELEMENT_DATA);

  @ViewChild(MatSort) sort: MatSort;

  applyFilter(filterValue: string) {
    console.log('k');
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit() {
    // this.api.getStudents().subscribe(
    //   res => {
    //     console.log(res);
    //     this.ELEMENT_DATA = res;
    //     this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    //     this.dataSource.sort = this.sort;
    //   },
    //   err => {
    //     console.log(err);
    //   },
    // );
    this.ELEMENT_DATA = marksAndstudentName;
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    this.dataSource.sort = this.sort;
    this.displayedColumns = [
      'studentName',
      ...this.columns.map(x => x.columnDef),
    ];
    // set groups
    // set group from url or default:
    this.selectedGroup = this.groups[0];
    this.filteredGroups = this.groups;

    // set disciplines
    // set discipline from url or default:
    this.selectedDiscipline = this.disciplines[0];
    this.filteredDisciplines = this.disciplines;
  }

  filterGroups(e) {
    if (!this.groups) {
      return;
    }
    const search = e ? e.toLowerCase() : '';
    this.filteredGroups = this.groups.filter(
      group => group.indexOf(search) !== -1,
    );
  }

  filterDisciplines(e) {
    if (!this.disciplines) {
      return;
    }
    const search = e ? e.toLowerCase() : '';
    this.filteredDisciplines = this.disciplines.filter(
      discipline => discipline.indexOf(search) !== -1,
    );
  }
}
