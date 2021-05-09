import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs';

import { GroupsApiService } from '../../services/groups-api.service';
import { IStudent } from '../../models/student.model';
import { DialogService } from '../../../core/services/dialog.service';
import { IGroup } from '../../models/group.model';

@Component({
  selector: 'app-groups-edit',
  templateUrl: './groups-edit.component.html',
  styleUrls: ['./groups-edit.component.scss'],
})
export class GroupsEditComponent implements OnInit {
  public displayedColumns: string[] = ['numberInList', 'firstName', 'lastName', 'email', 'delete', 'headStudent'];
  public dataSource: MatTableDataSource<IStudent> = new MatTableDataSource([]);
  @ViewChild(MatSort) public sort: MatSort;
  public selectedGroupId: string;

  public groupNumber: string = '';
  public group: IGroup;

  private ELEMENT_DATA: IStudent[] = [];
  private saved: boolean = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private api: GroupsApiService,
    private dialogService: DialogService
  ) {}

  public ngOnInit(): void {
    this.selectedGroupId = this.route.snapshot.paramMap.get('groupId');
    if (this.selectedGroupId) {
      this.getGroup(this.selectedGroupId);
    }
  }

  public applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public save(): void {
    if (!this.saved) {
      if (!this.group) {
        this.api
          .addGroup({
            groupNumber: this.groupNumber,
            students: this.ELEMENT_DATA.map(student => ({ ...student, id: +student.id < 0 ? null : student.id })),
          })
          .subscribe(res => {
            this.router.navigate([`/groups`]);
          });
      } else {
        this.api
          .updateGroup({
            groupNumber: this.groupNumber,
            id: this.group.id,
            students: this.ELEMENT_DATA.map(student => ({ ...student, id: +student.id < 0 ? null : student.id })),
          })
          .subscribe(res => {
            this.router.navigate([`/groups/${this.selectedGroupId}`]);
          });
      }
      this.saved = true;
    } else {
      alert('no changes to save!');
    }
  }

  public delete(e: string): void {
    this.saved = false;
    this.ELEMENT_DATA[this.ELEMENT_DATA.findIndex(student => student.id === e)].deleted = true;
  }

  public add(): void {
    this.saved = false;
    this.ELEMENT_DATA.push({
      firstName: '',
      lastName: '',
      numberInList: this.ELEMENT_DATA.length + 1,
      email: '',
      groupId: this.selectedGroupId,
      headStudent: false,
      deleted: false,
      id: `${-(this.ELEMENT_DATA.length + 1)}`,
    });
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    this.dataSource.sort = this.sort;
  }

  public cancelDelete(e: string): void {
    this.ELEMENT_DATA[this.ELEMENT_DATA.findIndex(student => student.id === e)].deleted = false;
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

  private getGroup(groupId: string): void {
    this.api.getGroup(groupId).subscribe(
      res => {
        this.group = res;
        this.groupNumber = res.groupNumber;
        this.ELEMENT_DATA = res.students;
        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
        this.dataSource.sort = this.sort;
      },
      err => {
        console.log(err);
      }
    );
  }
}
