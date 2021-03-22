import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';

import { DialogService } from 'src/app/core/services/dialog.service';
import { Teacher } from '../../models/teacher.model';
import { TeachersApiService } from '../../services/teachers-api.service';

@Component({
  selector: 'app-teachers-edit',
  templateUrl: './teachers-edit.component.html',
  styleUrls: ['./teachers-edit.component.scss'],
})
export class TeachersEditComponent implements OnInit {
  displayedColumns: string[] = [
    'firstName',
    'lastName',
    'email',
    'delete',
    'isAdmin',
  ];
  dataSource = new MatTableDataSource([]);
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  private ELEMENT_DATA: Teacher[] = [];
  private deletedTeachersIds: Set<number> = new Set();
  private oldTeachersJSON: string[];
  private saved = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private api: TeachersApiService,
    private dialogService: DialogService,
  ) {}

  ngOnInit() {
    this.getTeachers();
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  save() {
    const newTeachers = [];
    const addedTeachers = [];
    this.ELEMENT_DATA.forEach((value, index) => {
      if (this.oldTeachersJSON[index] !== JSON.stringify(value)) {
        newTeachers.push(value);
      }
      if (value.id === null) {
        addedTeachers.push(value);
      }
    });
    if (
      newTeachers.length > 0 ||
      addedTeachers.length > 0 ||
      this.deletedTeachersIds.size > 0
    ) {
      if (newTeachers.length > 0) {
        this.updateTeachers(newTeachers);
      }
      if (addedTeachers.length > 0) {
        this.addTeachers(addedTeachers);
      }
      if (this.deletedTeachersIds.size > 0) {
        this.deleteTeachers();
      }
      this.saved = true;
      this.router.navigate(['/teachers']);
    } else {
      alert('no changes to save!');
    }
  }

  delete(e) {
    this.saved = false;
    this.deletedTeachersIds.add(e.id);
  }

  add() {
    this.saved = false;
    this.ELEMENT_DATA.push({
      id: null,
      firstName: '',
      lastName: '',
      email: '',
      isAdmin: false,
      deleted: false,
      password: 'admin123',
    });
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    this.dataSource.sort = this.sort;
  }

  cancelDelete(e) {
    this.deletedTeachersIds.delete(e.id);
  }

  cancelAdd(e) {
    const index = this.ELEMENT_DATA.findIndex(
      v => JSON.stringify(v) === JSON.stringify(e),
    );
    this.ELEMENT_DATA.splice(index, 1);
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    this.dataSource.sort = this.sort;
  }

  isDeleted(row): boolean {
    if (this.deletedTeachersIds.has(row.id)) {
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

  private getTeachers(): void {
    this.api.getTeachers().then(
      res => {
        this.ELEMENT_DATA = res.result;
        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
        this.dataSource.sort = this.sort;
        this.oldTeachersJSON = this.ELEMENT_DATA.map(value =>
          JSON.stringify(value),
        );
      },
      err => {
        console.log(err);
      },
    );
  }

  private updateTeachers(newTeachers: Teacher[]) {
    this.api.updateTeachers(newTeachers).then(
      res => {
        console.log('Teachers were updated');
      },
      err => {
        console.log(err);
      },
    );
  }

  private addTeachers(addedTeachers) {
    this.api.addTeachers(addedTeachers).then(
      res => {
        console.log('Teachers were added');
      },
      err => {
        console.log(err);
      },
    );
  }

  private deleteTeachers() {
    this.api.deleteTeachers(this.deletedTeachersIds).then(
      res => {
        console.log('Teachers were deleted');
      },
      err => {
        console.log(err);
      },
    );
  }
}
