import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { IJob } from '../models/job.model';
import { HTTP_OPTIONS, MARKS, GROUPS, DISCIPLINES, JOBS, ATTENDANCES, MODULES } from '../../core/http-constants';
import { IAttendancesTableData, IAttendancesTableDataAttendance, ITableDataFromBE } from '../models/table-data.model';
import { IGroup } from '../../groups/models/group.model';
import { IDiscipline } from '../../disciplines/models/discipline.model';
import { IMarksModule } from '../models/module-jobs.model';

export const mockModulesJobs: IMarksModule[] = [
  {
    id: '1',
    moduleName: 'Module 1',
    jobs: [
      { id: '0', jobValue: 'Job 1', moduleId: '1', numberInList: 1 },
      { id: '1', jobValue: 'Job 2', moduleId: '1', numberInList: 2 },
      { id: '2', jobValue: 'Job 3', moduleId: '1', numberInList: 3 },
    ],
    numberInList: 1,
  },
  {
    id: '2',
    moduleName: 'Module 2',
    jobs: [
      { id: '3', jobValue: 'Job 4', moduleId: '2', numberInList: 1 },
      { id: '4', jobValue: 'Job 5', moduleId: '2', numberInList: 2 },
      { id: '5', jobValue: 'Job 6', moduleId: '2', numberInList: 3 },
    ],
    numberInList: 2,
  },
  {
    id: '3',
    moduleName: 'Module 3',
    jobs: [
      { id: '6', jobValue: 'Job 7', moduleId: '3', numberInList: 1 },
      { id: '7', jobValue: 'Job 8', moduleId: '3', numberInList: 2 },
      { id: '8', jobValue: 'Job 9', moduleId: '3', numberInList: 1 },
    ],
    numberInList: 4,
  },
];

export const mockAttendance: IAttendancesTableData = {
  students: [
    {
      id: '0',
      firstName: 'Ivan',
      lastName: 'Ivanov',
      numberInList: 1,
      email: 'ivan@stud.com',
      groupId: '1',
      headStudent: true,
      deleted: false,
    },
    {
      id: '1',
      firstName: 'Petr',
      lastName: 'Petrov',
      numberInList: 2,
      email: 'petr@stud.com',
      groupId: '1',
      headStudent: false,
      deleted: false,
    },
    {
      id: '2',
      firstName: 'Vasia',
      lastName: 'Vasiliev',
      numberInList: 3,
      email: 'vasia@stud.com',
      groupId: '1',
      headStudent: false,
      deleted: false,
    },
  ],
  attendances: [
    {
      id: '0',
      disciplineId: '0',
      attendanceName: '01/01',
      deleted: false,
      numberInList: 0,
      attendanceMarks: [
        { id: '0', studentId: '0', attendanceId: '0', attendanceMarkValue: true, deleted: false },
        { id: '1', studentId: '1', attendanceId: '0', attendanceMarkValue: false, deleted: false },
        { id: '2', studentId: '2', attendanceId: '0', attendanceMarkValue: true, deleted: false },
      ],
    },
    {
      id: '1',
      disciplineId: '1',
      attendanceName: '02/01',
      deleted: false,
      numberInList: 1,
      attendanceMarks: [
        { id: '3', studentId: '0', attendanceId: '1', attendanceMarkValue: false, deleted: false },
        { id: '4', studentId: '1', attendanceId: '1', attendanceMarkValue: false, deleted: false },
        { id: '5', studentId: '2', attendanceId: '1', attendanceMarkValue: true, deleted: false },
      ],
    },
  ],
};

@Injectable({
  providedIn: 'root',
})
export class MarksApiService {
  constructor(private http: HttpClient) {}

  public getMarks(disciplineId: string, groupId: string): Observable<ITableDataFromBE> {
    return this.http
      .get<ITableDataFromBE>(`${MARKS}`, {
        ...HTTP_OPTIONS,
        params: {
          groupId: groupId.toString(),
          disciplineId: disciplineId.toString(),
        },
      })
      .pipe(catchError(this.handleError));
  }

  public getDisciplines(): Observable<IDiscipline[]> {
    return this.http
      .get<IDiscipline[]>(`${DISCIPLINES}`, HTTP_OPTIONS)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  public getGroups(): Observable<IGroup[]> {
    return this.http.get<IGroup[]>(`${GROUPS}`, HTTP_OPTIONS).pipe(map(this.extractData), catchError(this.handleError));
  }

  public updateJobs(jobs: IJob[]): Observable<{ status: string }> {
    return this.http.put<{ status: string }>(`${JOBS}`, jobs, HTTP_OPTIONS).pipe(catchError(this.handleError));
  }

  public getModulesAndGroups(disciplineId: string, groupId: string): Observable<IMarksModule[]> {
    return (
      this.http
        // .get<IMarksModule[]>(`${MODULES}/jobs/${disciplineId}/${groupId}`, HTTP_OPTIONS)
        .get<IMarksModule[]>(`${MODULES}/jobs`, {
          ...HTTP_OPTIONS,
          params: {
            groupId: groupId.toString(),
            disciplineId: disciplineId.toString(),
          },
        })
        .pipe(map(this.extractData), catchError(this.handleError))
    );
  }

  public updateModulesAndGroups(
    disciplineId: string,
    groupId: string,
    modules: IMarksModule[]
  ): Observable<{ status: string }> {
    return this.http
      .put<{ status: string }>(`${MARKS}/${disciplineId}/${groupId}/jobs`, modules, HTTP_OPTIONS)
      .pipe(catchError(this.handleError));
  }

  public getAttendanceMarks(disciplineId: string, groupId: string): Observable<IAttendancesTableData> {
    return of(mockAttendance);
    // return this.http
    //   .get<IAttendancesTableData>(`${ATTENDANCES}`, {
    //     ...HTTP_OPTIONS,
    //     params: {
    //       groupId: groupId.toString(),
    //       disciplineId: disciplineId.toString(),
    //     },
    //   })
    //   .pipe(catchError(this.handleError));
  }

  public updateAttendances(attendances: IAttendancesTableDataAttendance[]): Observable<{ status: string }> {
    return this.http
      .put<{ status: string }>(`${ATTENDANCES}`, attendances, HTTP_OPTIONS)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }

  // tslint:disable-next-line: no-any
  private extractData<Type>(res: Type[]): Type[] {
    return res || [];
  }
}
