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

  public groupName: string = '';
  public group: IGroup;

  private ELEMENT_DATA: IStudent[] = [];
  private deletedStudentsIds: Set<string> = new Set();
  private oldStudentsJSON: string[];
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
      this.api.getGroup(this.selectedGroupId).subscribe((group: IGroup) => {
        this.group = group;
        this.groupName = group.groupNumber;
      });

      this.getStudents(this.selectedGroupId);
    }
  }

  public applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public save(): void {
    const newStudents: IStudent[] = [];
    const addedStudents: IStudent[] = [];
    this.ELEMENT_DATA.forEach((value, index) => {
      if (this.oldStudentsJSON && this.oldStudentsJSON[index] !== JSON.stringify(value)) {
        newStudents.push(value);
      }
      if (value.id === null) {
        addedStudents.push(value);
      }
    });
    if (
      !this.group ||
      this.group.groupNumber !== this.groupName ||
      newStudents.length > 0 ||
      addedStudents.length > 0 ||
      this.deletedStudentsIds.size > 0
    ) {
      if (!this.group) {
        this.addGroup(addedStudents);
      } else {
        if (this.group.groupNumber !== this.groupName) {
          this.updateGroup();
        }
        if (newStudents.length > 0) {
          this.updateStudents(newStudents);
        }
        if (addedStudents.length > 0) {
          this.addStudents(addedStudents);
        }
        if (this.deletedStudentsIds.size > 0) {
          this.deleteStudents();
        }
        this.router.navigate([`/groups/${this.selectedGroupId}`]);
      }
      this.saved = true;
    } else {
      alert('no changes to save!');
    }
  }

  public delete(e: IStudent): void {
    this.saved = false;
    this.deletedStudentsIds.add(e.id);
  }

  public add(): void {
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

  public cancelDelete(e: IStudent): void {
    this.deletedStudentsIds.delete(e.id);
  }

  public cancelAdd(e: IStudent): void {
    const index: number = this.ELEMENT_DATA.findIndex(v => JSON.stringify(v) === JSON.stringify(e));
    this.ELEMENT_DATA.splice(index, 1);
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    this.dataSource.sort = this.sort;
  }

  public isDeleted(row: IStudent): boolean {
    if (this.deletedStudentsIds.has(row.id)) {
      return true;
    } else {
      return false;
    }
  }

  public isAdded(row: IStudent): boolean {
    if (row.id === null) {
      return true;
    } else {
      return false;
    }
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

  private getStudents(groupId: string): void {
    this.api.getStudents(groupId).subscribe(
      res => {
        this.ELEMENT_DATA = res;
        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
        this.dataSource.sort = this.sort;
        this.oldStudentsJSON = this.ELEMENT_DATA.map(value => JSON.stringify(value));
      },
      err => {
        console.log(err);
      }
    );
  }

  private updateStudents(newStudents: IStudent[]): void {
    this.api.updateStudents(newStudents).subscribe(
      res => {
        console.log('students were updated');
      },
      err => {
        console.log(err);
      }
    );
  }

  private addStudents(addedStudents: IStudent[]): void {
    this.api.addStudents(addedStudents).subscribe(
      res => {
        console.log('students were added');
      },
      err => {
        console.log(err);
      }
    );
  }

  private deleteStudents(): void {
    this.api.deleteStudents(this.deletedStudentsIds).subscribe(
      res => {
        console.log('students were deleted');
      },
      err => {
        console.log(err);
      }
    );
  }

  private addGroup(addedStudents: IStudent[]): void {
    this.api.addGroup(this.groupName, addedStudents).subscribe(
      res => {
        console.log('group was added');
        this.router.navigate([`/groups/${res.id}`]);
      },
      err => {
        console.log(err);
      }
    );
  }

  private updateGroup(): void {
    this.api.updateGroup(this.group.id, this.groupName).subscribe(
      res => {
        console.log('group was added');
      },
      err => {
        console.log(err);
      }
    );
  }
}
