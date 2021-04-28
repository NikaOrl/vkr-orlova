import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';

import { DialogService } from '../../../core/services/dialog.service';
import { ITeacher } from '../../models/teacher.model';
import { TeachersApiService } from '../../services/teachers-api.service';

@Component({
  selector: 'app-teachers-edit',
  templateUrl: './teachers-edit.component.html',
  styleUrls: ['./teachers-edit.component.scss'],
})
export class TeachersEditComponent implements OnInit {
  public displayedColumns: string[] = ['firstName', 'lastName', 'email', 'delete', 'isAdmin'];
  public dataSource: MatTableDataSource<ITeacher> = new MatTableDataSource([]);
  @ViewChild(MatSort) public sort: MatSort;

  private ELEMENT_DATA: ITeacher[] = [];
  private deletedTeachersIds: Set<string> = new Set();
  private oldTeachersJSON: string[];
  private saved: boolean = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private api: TeachersApiService,
    private dialogService: DialogService
  ) {}

  public ngOnInit(): void {
    this.getTeachers();
  }

  public applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public save(): void {
    const newTeachers: ITeacher[] = [];
    const addedTeachers: ITeacher[] = [];
    this.ELEMENT_DATA.forEach((value, index) => {
      if (this.oldTeachersJSON[index] !== JSON.stringify(value)) {
        newTeachers.push(value);
      }
      if (value.id === null) {
        addedTeachers.push(value);
      }
    });
    if (newTeachers.length > 0 || addedTeachers.length > 0 || this.deletedTeachersIds.size > 0) {
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

  public delete(e: ITeacher): void {
    this.saved = false;
    this.deletedTeachersIds.add(e.id);
  }

  public add(): void {
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

  public cancelDelete(e: ITeacher): void {
    this.deletedTeachersIds.delete(e.id);
  }

  public cancelAdd(e: ITeacher): void {
    const index: number = this.ELEMENT_DATA.findIndex(v => JSON.stringify(v) === JSON.stringify(e));
    this.ELEMENT_DATA.splice(index, 1);
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    this.dataSource.sort = this.sort;
  }

  public isDeleted(row: ITeacher): boolean {
    return this.deletedTeachersIds.has(row.id);
  }

  public isAdded(row: ITeacher): boolean {
    return row.id === null;
  }

  public unsaved(): void {
    this.saved = false;
  }

  public canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.saved) {
      return true;
    }
    return this.dialogService.confirm('Discard changes?');
  }

  private getTeachers(): void {
    this.api.getTeachers().subscribe(
      res => {
        this.ELEMENT_DATA = res;
        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
        this.dataSource.sort = this.sort;
        this.oldTeachersJSON = this.ELEMENT_DATA.map(value => JSON.stringify(value));
      },
      err => {
        console.log(err);
      }
    );
  }

  private updateTeachers(newTeachers: ITeacher[]): void {
    this.api.updateTeachers(newTeachers).subscribe(
      res => {
        console.log('Teachers were updated');
      },
      err => {
        console.log(err);
      }
    );
  }

  private addTeachers(addedTeachers: ITeacher[]): void {
    this.api.addTeachers(addedTeachers).then(
      res => {
        console.log('Teachers were added');
      },
      err => {
        console.log(err);
      }
    );
  }

  private deleteTeachers(): void {
    this.api.deleteTeachers(this.deletedTeachersIds).subscribe(
      res => {
        console.log('Teachers were deleted');
      },
      err => {
        console.log(err);
      }
    );
  }
}
