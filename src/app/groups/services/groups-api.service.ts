import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { IStudent } from '../models/student.model';
import { IGroup } from '../models/group.model';
import { HTTP_OPTIONS, STUDENTS } from '../../core/http-constants';

@Injectable({
  providedIn: 'root',
})
export class GroupsApiService {
  constructor(private http: HttpClient) {}

  public getStudents(groupId: number): Promise<{ result: IStudent[] }> {
    return this.http
      .get<{ result: IStudent[] }>(`${STUDENTS}/group/${groupId}`, HTTP_OPTIONS)
      .pipe(map(this.extractData), catchError(this.handleError))
      .toPromise();
  }

  public getGroups(): Promise<{ result: IGroup[] }> {
    return this.http
      .get<{ result: IGroup[] }>(`${STUDENTS}/groups`, HTTP_OPTIONS)
      .pipe(map(this.extractData), catchError(this.handleError))
      .toPromise();
  }

  public updateStudents(students: IStudent[]): Promise<{ status: string }> {
    return this.http
      .put<{ status: string }>(`${STUDENTS}/update`, students, HTTP_OPTIONS)
      .pipe(catchError(this.handleError))
      .toPromise();
  }

  public addStudents(students: IStudent[]): Promise<{ result: number[] }> {
    return this.http
      .post<{ result: number[] }>(`${STUDENTS}/add`, students, HTTP_OPTIONS)
      .pipe(catchError(this.handleError))
      .toPromise();
  }

  public deleteStudents(studentsIds: Set<number>): Promise<{ result: number }> {
    let urlParams: string = '';
    studentsIds.forEach(id => {
      urlParams += `id=${id}&`;
    });
    urlParams = urlParams.substring(0, urlParams.length - 1);
    return this.http
      .delete<{ result: number }>(`${STUDENTS}/delete?${urlParams}`, HTTP_OPTIONS)
      .pipe(catchError(this.handleError))
      .toPromise();
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
  private extractData(res: { result: IGroup[] } | { result: IStudent[] }): any {
    return res || { result: [] };
  }
}
