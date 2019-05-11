import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { GroupsApiService } from 'src/app/groups/services/api.service';

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
  selectedGroup: string;
  groups = ['5381', '5382', '5383', '3462', '5281', '5678', '3451'];
  filteredGroups: string[];

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
    this.api.getStudents().subscribe(
      res => {
        this.ELEMENT_DATA = res;
        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
        this.dataSource.sort = this.sort;
      },
      err => {
        console.log(err);
      },
    );
    // set groups
    // set group from url or default:
    this.selectedGroup = this.groups[0];
    this.filteredGroups = this.groups;
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
}
