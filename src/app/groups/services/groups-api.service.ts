import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { IStudent } from '../models/student.model';
import { IGroup } from '../models/group.model';
import { GROUPS, HTTP_OPTIONS, STUDENTS } from '../../core/http-constants';

@Injectable({
  providedIn: 'root',
})
export class GroupsApiService {
  constructor(private http: HttpClient) {}

  public getStudents(groupId: number): Observable<IStudent[]> {
    return this.http
      .get<IStudent[]>(`${STUDENTS}/${groupId}`, HTTP_OPTIONS)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  public getGroups(): Observable<IGroup[]> {
    return this.http.get<IGroup[]>(`${GROUPS}`, HTTP_OPTIONS).pipe(map(this.extractData), catchError(this.handleError));
  }

  public updateStudents(students: IStudent[]): Observable<{ status: string }> {
    return this.http.put<{ status: string }>(`${STUDENTS}`, students, HTTP_OPTIONS).pipe(catchError(this.handleError));
  }

  public addStudents(students: IStudent[]): Observable<number[]> {
    return this.http.post<number[]>(`${STUDENTS}`, students, HTTP_OPTIONS).pipe(catchError(this.handleError));
  }

  public deleteStudents(studentsIds: Set<number>): Observable<number> {
    return this.http
      .delete<number>(`${STUDENTS}`, {
        ...HTTP_OPTIONS,
        params: {
          ids: [...studentsIds].map(id => id.toString()),
        },
      })
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
  private extractData(res: IGroup[] | IStudent[]): any {
    return res || [];
  }
}
