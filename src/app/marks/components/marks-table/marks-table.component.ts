import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { MarksApiService } from 'src/app/marks/services/api.service';

export interface PeriodicElement {
  firstName: string;
  lastName: string;
  id: number;
  numberInList: number;
  email: string;
  hashPassword: string;
  registrationDate?: Date;
  groupNumber: number;
  headStudent: boolean;
}

@Component({
  selector: 'app-marks-table',
  templateUrl: './marks-table.component.html',
  styleUrls: ['./marks-table.component.scss'],
})
export class MarksTableComponent implements OnInit {
  ELEMENT_DATA: PeriodicElement[] = [];
  constructor(private api: MarksApiService) {}

  displayedColumns: string[] = [
    'numberInList',
    'firstName',
    'lastName',
    'email',
  ];

  dataSource = new MatTableDataSource(this.ELEMENT_DATA);

  @ViewChild(MatSort) sort: MatSort;

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit() {
    this.api.getStudents().subscribe(
      res => {
        console.log(res);
        this.ELEMENT_DATA = res;
        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
        this.dataSource.sort = this.sort;
      },
      err => {
        console.log(err);
      },
    );
  }
}
