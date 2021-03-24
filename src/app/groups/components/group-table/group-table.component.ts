import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';

import { GroupsApiService } from '../../services/groups-api.service';
import { IGroup } from '../../models/group.model';
import { IStudent } from '../../models/student.model';

@Component({
  selector: 'app-group-table',
  templateUrl: './group-table.component.html',
  styleUrls: ['./group-table.component.scss'],
})
export class GroupTableComponent implements OnInit {
  public ELEMENT_DATA: IStudent[] = [];
  public selectedGroup: IGroup;
  public groups: IGroup[];
  public filteredGroups: IGroup[];
  public displayedColumns: string[] = ['numberInList', 'firstName', 'lastName', 'email', 'headStudent'];
  public dataSource: MatTableDataSource<IStudent> = new MatTableDataSource(this.ELEMENT_DATA);

  @ViewChild(MatSort) public sort: MatSort;

  constructor(private router: Router, private route: ActivatedRoute, private api: GroupsApiService) {}

  public ngOnInit(): void {
    this.api.getGroups().then(
      res => {
        this.groups = res.result;
        const selectedGroupId: number = +this.route.snapshot.paramMap.get('groupId');
        this.selectedGroup = selectedGroupId ? this.groups.find(group => group.id === selectedGroupId) : this.groups[0];
        this.filteredGroups = this.groups;

        this.getStudents(this.selectedGroup.id);
      },
      err => {
        console.log(err);
      }
    );
  }

  public applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public filterGroups(e: string): void {
    if (!this.groups) {
      return;
    }
    const search: string = e ? e.toLowerCase() : '';
    this.filteredGroups = this.groups.filter(group => `${group.groupNumber}`.indexOf(search) !== -1);
  }

  public onSelectedGroupChange(): void {
    this.router.navigate([`/groups/${this.selectedGroup.id}`]);
    this.getStudents(this.selectedGroup.id);
  }

  public getStudents(groupId: number): void {
    this.api.getStudents(groupId).then(
      res => {
        this.ELEMENT_DATA = res.result;
        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
        this.dataSource.sort = this.sort;
      },
      err => {
        console.log(err);
      }
    );
  }
}
