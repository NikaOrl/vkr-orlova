import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';

import { GroupsApiService } from 'src/app/groups/services/groups-api.service';
import { Student } from '../../models/student.model';

@Component({
  selector: 'app-group-table',
  templateUrl: './group-table.component.html',
  styleUrls: ['./group-table.component.scss'],
})
export class GroupTableComponent implements OnInit {
  ELEMENT_DATA: Student[] = [];
  selectedGroup: any;
  groups: any[];
  filteredGroups: any[];
  displayedColumns: string[] = [
    'numberInList',
    'firstName',
    'lastName',
    'email',
  ];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);

  @ViewChild(MatSort) sort: MatSort;

  constructor(private api: GroupsApiService) {}

  ngOnInit() {
    this.api.getGroups().then(
      res => {
        this.groups = res.result;
        this.selectedGroup = this.groups[0];
        this.filteredGroups = this.groups;

        this.getStudents(this.selectedGroup.id);
      },
      err => {
        console.log(err);
      },
    );
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  filterGroups(e): void {
    if (!this.groups) {
      return;
    }
    const search = e ? e.toLowerCase() : '';
    this.filteredGroups = this.groups.filter(
      group => `${group.groupNumber}`.indexOf(search) !== -1,
    );
  }

  onSelectedGroupChange(): void {
    this.getStudents(this.selectedGroup.id);
  }

  getStudents(groupId: number): void {
    this.api.getStudents(groupId).then(
      res => {
        this.ELEMENT_DATA = res.result;
        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
        this.dataSource.sort = this.sort;
      },
      err => {
        console.log(err);
      },
    );
  }
}
