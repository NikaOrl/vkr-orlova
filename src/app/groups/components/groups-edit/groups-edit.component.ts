import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import { GroupsApiService } from '../../services/groups-api.service';
import { Student } from '../../models/student.model';

@Component({
  selector: 'app-groups-edit',
  templateUrl: './groups-edit.component.html',
  styleUrls: ['./groups-edit.component.scss'],
})
export class GroupsEditComponent implements OnInit {
  ELEMENT_DATA: Student[] = [];
  selectedGroupId: number;
  displayedColumns: string[] = [
    'numberInList',
    'firstName',
    'lastName',
    'email',
  ];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);

  constructor(private route: ActivatedRoute, private api: GroupsApiService) {}

  ngOnInit() {
    this.selectedGroupId = +this.route.snapshot.paramMap.get('groupId');
    this.getStudents(this.selectedGroupId);
  }

  getStudents(groupId: number): void {
    this.api.getStudents(groupId).then(
      res => {
        this.ELEMENT_DATA = res.result;
        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
      },
      err => {
        console.log(err);
      },
    );
  }
}
