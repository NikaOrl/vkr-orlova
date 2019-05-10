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
  }
}
