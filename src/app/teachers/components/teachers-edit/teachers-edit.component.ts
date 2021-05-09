import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

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
  public displayedColumns: string[] = ['firstName', 'lastName', 'email', 'password', 'delete', 'isAdmin'];
  public dataSource: MatTableDataSource<ITeacher> = new MatTableDataSource([]);
  @ViewChild(MatSort) public sort: MatSort;

  private ELEMENT_DATA: ITeacher[] = [];
  private saved: boolean = true;

  constructor(private router: Router, private api: TeachersApiService, private dialogService: DialogService) {}

  public ngOnInit(): void {
    this.getTeachers();
  }

  public applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public save(): void {
    const teachers: ITeacher[] = this.ELEMENT_DATA.map(value => ({
      firstName: value.firstName,
      lastName: value.lastName,
      id: +value.id < 0 ? null : value.id,
      password: value.password,
      email: value.email,
      isAdmin: value.isAdmin,
      deleted: value.deleted,
    }));
    if (!this.saved) {
      this.api.updateTeachers(teachers).subscribe(res => {
        this.saved = true;
        this.router.navigate(['/teachers']);
      });
    } else {
      alert('no changes to save!');
    }
  }

  public delete(e: string): void {
    this.saved = false;
    this.ELEMENT_DATA[this.ELEMENT_DATA.findIndex(teacher => teacher.id === e)].deleted = true;
  }

  public add(): void {
    this.saved = false;
    this.ELEMENT_DATA.push({
      firstName: '',
      lastName: '',
      email: '',
      isAdmin: false,
      deleted: false,
      password: '',
      id: `${-(this.ELEMENT_DATA.length + 1)}`,
    });
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    this.dataSource.sort = this.sort;
  }

  public cancelDelete(e: string): void {
    this.ELEMENT_DATA[this.ELEMENT_DATA.findIndex(teacher => teacher.id === e)].deleted = false;
  }

  public cancelAdd(e: string): void {
    const index: number = this.ELEMENT_DATA.findIndex(v => v.id === e);
    this.ELEMENT_DATA.splice(index, 1);
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    this.dataSource.sort = this.sort;
  }

  public isDeleted(e: string): boolean {
    return !!this.ELEMENT_DATA[this.ELEMENT_DATA.findIndex(teacher => teacher && teacher.id === e)].deleted;
  }

  public isAdded(e: string): boolean {
    return +this.ELEMENT_DATA[this.ELEMENT_DATA.findIndex(teacher => teacher && teacher.id === e)].id < 0;
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
        this.ELEMENT_DATA = res.map(teacher => ({ ...teacher, hide: true }));
        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
        this.dataSource.sort = this.sort;
      },
      err => {
        console.log(err);
      }
    );
  }
}
