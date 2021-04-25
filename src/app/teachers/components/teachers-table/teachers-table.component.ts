import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { ITeacher } from '../../models/teacher.model';
import { TeachersApiService } from '../../services/teachers-api.service';

@Component({
  selector: 'app-teachers-table',
  templateUrl: './teachers-table.component.html',
  styleUrls: ['./teachers-table.component.scss'],
})
export class TeachersTableComponent implements OnInit {
  public ELEMENT_DATA: ITeacher[] = [];
  public displayedColumns: string[] = ['firstName', 'lastName', 'email', 'isAdmin'];
  public dataSource: MatTableDataSource<ITeacher> = new MatTableDataSource(this.ELEMENT_DATA);

  @ViewChild(MatSort) public sort: MatSort;

  constructor(private api: TeachersApiService) {}

  public ngOnInit(): void {
    this.getTeachers();
  }

  public applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public getTeachers(): void {
    this.api.getTeachers().then(
      res => {
        this.ELEMENT_DATA = res;
        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
        this.dataSource.sort = this.sort;
      },
      err => {
        console.log(err);
      }
    );
  }
}
