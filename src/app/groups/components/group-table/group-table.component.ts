import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { GroupsApiService } from 'src/app/groups/services/groups-api.service';

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
  selector: 'app-group-table',
  templateUrl: './group-table.component.html',
  styleUrls: ['./group-table.component.scss'],
})
export class GroupTableComponent implements OnInit {
  ELEMENT_DATA: PeriodicElement[] = [];
  selectedGroup: any;
  groups: any[];
  filteredGroups: any[];

  constructor(private api: GroupsApiService) {}

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

  filterGroups(e) {
    if (!this.groups) {
      return;
    }
    const search = e ? e.toLowerCase() : '';
    this.filteredGroups = this.groups.filter(
      group => `${group.groupNumber}`.indexOf(search) !== -1,
    );
  }

  onSelectedGroupChange() {
    this.getStudents(this.selectedGroup.id);
  }

  getStudents(groupId) {
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
