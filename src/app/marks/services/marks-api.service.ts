import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { IJob } from '../models/job.model';
import { HTTP_OPTIONS, MARKS, GROUPS, DISCIPLINES, JOBS, ATTENDANCES, MODULES } from '../../core/http-constants';
import { IAttendancesTableData, IAttendancesTableDataAttendance, ITableDataFromBE } from '../models/table-data.model';
import { IGroup } from '../../groups/models/group.model';
import { IDiscipline } from '../../disciplines/models/discipline.model';
import { IMarksModule } from '../models/module-jobs.model';

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
    return this.http
      .get<IMarksModule[]>(`${MODULES}/jobs`, {
        ...HTTP_OPTIONS,
        params: {
          groupId: groupId.toString(),
          disciplineId: disciplineId.toString(),
        },
      })
      .pipe(map(this.extractData), catchError(this.handleError));
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
    return this.http
      .get<IAttendancesTableData>(`${ATTENDANCES}`, {
        ...HTTP_OPTIONS,
        params: {
          groupId: groupId.toString(),
          disciplineId: disciplineId.toString(),
        },
      })
      .pipe(catchError(this.handleError));
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
