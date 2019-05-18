import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

import { GroupsApiService } from '../../services/groups-api.service';
import { Student } from '../../models/student.model';

@Component({
  selector: 'app-groups-edit',
  templateUrl: './groups-edit.component.html',
  styleUrls: ['./groups-edit.component.scss'],
})
export class GroupsEditComponent implements OnInit {
  ELEMENT_DATA: Student[] = [];
  students: Student[] = [];
  deletedStudentsIds: Set<number> = new Set();

  oldStudentsJSON: string[];
  selectedGroupId: number;
  displayedColumns: string[] = [
    'numberInList',
    'firstName',
    'lastName',
    'email',
    'delete',
  ];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private api: GroupsApiService,
  ) {}

  ngOnInit() {
    this.selectedGroupId = +this.route.snapshot.paramMap.get('groupId');
    this.getStudents(this.selectedGroupId);
  }

  getStudents(groupId: number): void {
    this.api.getStudents(groupId).then(
      res => {
        this.ELEMENT_DATA = res.result;
        this.students = [...res.result];
        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
        this.oldStudentsJSON = this.ELEMENT_DATA.map(value =>
          JSON.stringify(value),
        );
      },
      err => {
        console.log(err);
      },
    );
  }

  updateStudents(newStudents: Student[]) {
    this.api.updateStudents(newStudents).then(
      res => {
        console.log('students were updated');
      },
      err => {
        console.log(err);
      },
    );
  }

  addStudents(addedStudents) {
    this.api.addStudents(addedStudents).then(
      res => {
        console.log('students were added');
      },
      err => {
        console.log(err);
      },
    );
  }

  deleteStudents() {
    this.api.deleteStudents(this.deletedStudentsIds).then(
      res => {
        console.log('students were deleted');
      },
      err => {
        console.log(err);
      },
    );
  }

  save() {
    const newStudents = [];
    this.students.forEach((value, index) => {
      if (this.oldStudentsJSON[index] !== JSON.stringify(value)) {
        newStudents.push(value);
      }
    });

    const addedStudents = [];
    this.ELEMENT_DATA.forEach(value => {
      if (value.id === null) {
        addedStudents.push(value);
      }
    });
    if (
      newStudents.length > 0 ||
      addedStudents.length > 0 ||
      this.deletedStudentsIds.size > 0
    ) {
      if (newStudents.length > 0) {
        this.updateStudents(newStudents);
      }
      if (addedStudents.length > 0) {
        this.addStudents(addedStudents);
      }
      if (this.deletedStudentsIds.size > 0) {
        this.deleteStudents();
      }
      this.router.navigate(['/groups']);
    } else {
      alert('no changes to save!');
    }
  }

  isDeleted(row): boolean {
    if (this.deletedStudentsIds.has(row.id)) {
      return true;
    } else {
      return false;
    }
  }

  isAdded(row): boolean {
    if (row.id === null) {
      return true;
    } else {
      return false;
    }
  }

  delete(e) {
    this.deletedStudentsIds.add(e.id);
  }

  add() {
    this.ELEMENT_DATA.push({
      id: null,
      firstName: '',
      lastName: '',
      numberInList: null,
      email: '',
      groupId: this.selectedGroupId,
      headStudent: false,
      deleted: false,
    });
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  }

  cancelDelete(e) {
    this.deletedStudentsIds.delete(e.id);
  }

  cancelAdd(e) {
    const index = this.ELEMENT_DATA.findIndex(
      v => JSON.stringify(v) === JSON.stringify(e),
    );
    this.ELEMENT_DATA.splice(index, 1);
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  }
}
