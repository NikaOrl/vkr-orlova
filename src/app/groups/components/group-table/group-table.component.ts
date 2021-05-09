import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

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
  public selectValue: string | IGroup;

  public fileToUpload: File | null;
  public progress: number = 0;
  public errorMessage: string;

  @ViewChild(MatSort) public sort: MatSort;

  constructor(private router: Router, private route: ActivatedRoute, private api: GroupsApiService) {}

  public ngOnInit(): void {
    this.api.getGroups().subscribe(
      groups => {
        this.groups = groups;
        const selectedGroupId: string = this.route.snapshot.paramMap.get('groupId');
        this.selectedGroup = selectedGroupId ? this.groups.find(group => group.id === selectedGroupId) : this.groups[0];
        this.selectValue = this.selectedGroup?.groupNumber ? this.selectedGroup.groupNumber.toString() : '';
        this.filteredGroups = this.groups;

        if (this.selectedGroup) {
          this.getGroup(this.selectedGroup.id);
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  public applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public selectGroup(group: IGroup): void {
    this.selectedGroup = group;
    this.onSelectedGroupChange();
  }

  public displayFn(group: IGroup | string): string {
    if (group) {
      return (group as IGroup).groupNumber ? (group as IGroup).groupNumber.toString() : (group as string);
    }
    return '';
  }

  public onSelectedGroupChange(): void {
    this.router.navigate([`/groups/${this.selectedGroup.id}`]);
    this.getGroup(this.selectedGroup.id);
  }

  public getGroup(groupId: string): void {
    this.api.getGroup(groupId).subscribe(
      res => {
        this.ELEMENT_DATA = res.students;
        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
        this.dataSource.sort = this.sort;
      },
      err => {
        console.log(err);
      }
    );
  }

  public filter(): void {
    const filterValue: string = this.displayFn(this.selectValue);
    this.filteredGroups = this.groups.filter(
      option => `${option.groupNumber}`.toLowerCase().indexOf(filterValue) === 0
    );
    this.selectValue = filterValue;
  }

  public get isAdmin(): boolean {
    const user: string = localStorage.getItem('currentUser');
    return user && `${user}` !== 'undefined' ? JSON.parse(user).isAdmin : false;
  }

  public onFilesBrowse(event: Event): void {
    const target: HTMLInputElement = event.target as HTMLInputElement;
    if (target.files) {
      this.onFilesDrop(target.files);
    }
  }

  public onFilesDrop(files: FileList): void {
    this.errorMessage = '';
    this.fileToUpload = files[0];

    this.api
      .uploadExcel(this.fileToUpload, this.selectedGroup.id)
      .pipe(
        catchError((errorResponse: HttpErrorResponse) => {
          // TODO: Consider better error message constructing
          this.errorMessage = errorResponse.error.error;
          return of(null);
        })
      )
      .subscribe((event: HttpEvent<any>) => {
        if (event?.type === HttpEventType.UploadProgress && event.total) {
          this.progress = Math.round((event.loaded / event.total) * 100);
        }

        if (event?.type === HttpEventType.Response) {
          // TODO: Share event.body to some service in order to define form table fields
        }
      });
  }
}
