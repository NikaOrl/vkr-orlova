import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { MarksApiService } from 'src/app/marks/services/api.service';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs';

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
export class StudentsDataSource extends DataSource<any> {
  constructor(private api: MarksApiService) {
    super();
  }

  connect() {
    return this.api.getStudents();
  }

  disconnect() {}
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

  dataSource = new StudentsDataSource(this.api);

  @ViewChild(MatSort) sort: MatSort;

  // applyFilter(filterValue: string) {
  //   this.dataSource.filter = filterValue.trim().toLowerCase();
  // }

  ngOnInit() {
    this.api.getStudents().subscribe(
      res => {
        console.log(res);
        this.ELEMENT_DATA = res;
      },
      err => {
        console.log(err);
      },
    );

    // this.dataSource.sort = this.sort;
  }
}
