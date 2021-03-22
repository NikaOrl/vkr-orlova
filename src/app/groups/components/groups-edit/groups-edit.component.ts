import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs';

import { GroupsApiService } from '../../services/groups-api.service';
import { Student } from '../../models/student.model';
import { DialogService } from 'src/app/core/services/dialog.service';

@Component({
  selector: 'app-groups-edit',
  templateUrl: './groups-edit.component.html',
  styleUrls: ['./groups-edit.component.scss'],
})
export class GroupsEditComponent implements OnInit {
  displayedColumns: string[] = [
    'numberInList',
    'firstName',
    'lastName',
    'email',
    'delete',
    'headStudent',
  ];
  dataSource = new MatTableDataSource([]);
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  public selectedGroupId: number;

  private ELEMENT_DATA: Student[] = [];
  private deletedStudentsIds: Set<number> = new Set();
  private oldStudentsJSON: string[];
  private saved = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private api: GroupsApiService,
    private dialogService: DialogService
  ) {}

  ngOnInit() {
    this.selectedGroupId = +this.route.snapshot.paramMap.get('groupId');
    this.getStudents(this.selectedGroupId);
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  save() {
    const newStudents = [];
    const addedStudents = [];
    this.ELEMENT_DATA.forEach((value, index) => {
      if (this.oldStudentsJSON[index] !== JSON.stringify(value)) {
        newStudents.push(value);
      }
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
      this.saved = true;
      this.router.navigate([`/groups/${this.selectedGroupId}`]);
    } else {
      alert('no changes to save!');
    }
  }

  delete(e) {
    this.saved = false;
    this.deletedStudentsIds.add(e.id);
  }

  add() {
    this.saved = false;
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
    this.dataSource.sort = this.sort;
  }

  cancelDelete(e) {
    this.deletedStudentsIds.delete(e.id);
  }

  cancelAdd(e) {
    const index = this.ELEMENT_DATA.findIndex(
      (v) => JSON.stringify(v) === JSON.stringify(e)
    );
    this.ELEMENT_DATA.splice(index, 1);
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    this.dataSource.sort = this.sort;
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

  unsaved() {
    this.saved = false;
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.saved) {
      return true;
    }
    return this.dialogService.confirm('Discard changes?');
  }

  private getStudents(groupId: number): void {
    this.api.getStudents(groupId).then(
      (res) => {
        this.ELEMENT_DATA = res.result;
        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
        this.dataSource.sort = this.sort;
        this.oldStudentsJSON = this.ELEMENT_DATA.map((value) =>
          JSON.stringify(value)
        );
      },
      (err) => {
        console.log(err);
      }
    );
  }

  private updateStudents(newStudents: Student[]) {
    this.api.updateStudents(newStudents).then(
      (res) => {
        console.log('students were updated');
      },
      (err) => {
        console.log(err);
      }
    );
  }

  private addStudents(addedStudents) {
    this.api.addStudents(addedStudents).then(
      (res) => {
        console.log('students were added');
      },
      (err) => {
        console.log(err);
      }
    );
  }

  private deleteStudents() {
    this.api.deleteStudents(this.deletedStudentsIds).then(
      (res) => {
        console.log('students were deleted');
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
