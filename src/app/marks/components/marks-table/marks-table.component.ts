import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';

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

const ELEMENT_DATA: PeriodicElement[] = [
  {
    id: 1,
    firstName: 'Ivan',
    lastName: 'Ivanov',
    numberInList: 1,
    email: 'ivan@stud.com',
    hashPassword: '123',
    groupNumber: 5381,
    headStudent: true,
  },
  {
    id: 2,
    firstName: 'Petr',
    lastName: 'Petrov',
    numberInList: 2,
    email: 'petr@stud.com',
    hashPassword: '123',
    groupNumber: 5381,
    headStudent: false,
  },
  {
    id: 3,
    firstName: 'Vasia',
    lastName: 'Vasiliev',
    numberInList: 3,
    email: 'vasia@stud.com',
    hashPassword: '123',
    groupNumber: 5381,
    headStudent: false,
  },
  {
    id: 4,
    firstName: 'Sergei',
    lastName: 'Sergeev',
    numberInList: 4,
    email: 'serg@stud.com',
    hashPassword: '123',
    groupNumber: 5381,
    headStudent: false,
  },
];

@Component({
  selector: 'app-marks-table',
  templateUrl: './marks-table.component.html',
  styleUrls: ['./marks-table.component.scss'],
})
export class MarksTableComponent implements OnInit {
  constructor() {}
  displayedColumns: string[] = [
    'numberInList',
    'firstName',
    'lastName',
    'email',
  ];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  @ViewChild(MatSort) sort: MatSort;

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit() {
    this.dataSource.sort = this.sort;
  }
}
