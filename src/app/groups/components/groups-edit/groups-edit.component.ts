import { Component, OnInit } from '@angular/core';
import { GroupsApiService } from '../../services/groups-api.service';
import { MatTableDataSource } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

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
  selector: 'app-groups-edit',
  templateUrl: './groups-edit.component.html',
  styleUrls: ['./groups-edit.component.scss'],
})
export class GroupsEditComponent implements OnInit {
  ELEMENT_DATA: PeriodicElement[] = [];
  selectedGroupId: number;

  constructor(private route: ActivatedRoute, private api: GroupsApiService) {}

  displayedColumns: string[] = [
    'numberInList',
    'firstName',
    'lastName',
    'email',
  ];

  dataSource = new MatTableDataSource(this.ELEMENT_DATA);

  ngOnInit() {
    this.selectedGroupId = +this.route.snapshot.paramMap.get('groupId');
    this.getStudents(this.selectedGroupId);
  }

  getStudents(groupId) {
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
