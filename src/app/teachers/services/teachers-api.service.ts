import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ITeacher } from '../models/teacher.model';
import { HTTP_OPTIONS, TEACHERS } from '../../core/http-constants';
@Injectable({
  providedIn: 'root',
})
export class TeachersApiService {
  constructor(private http: HttpClient) {}

  public getTeachers(): Promise<{ result: ITeacher[] }> {
    return this.http
      .get<{ result: ITeacher[] }>(`${TEACHERS}`, HTTP_OPTIONS)
      .pipe(map(this.extractData), catchError(this.handleError))
      .toPromise();
  }

  public updateTeachers(teachers: ITeacher[]): Promise<{ status: string }> {
    return this.http
      .put<{ status: string }>(`${TEACHERS}/update`, teachers, HTTP_OPTIONS)
      .pipe(catchError(this.handleError))
      .toPromise();
  }

  // tslint:disable-next-line: no-any
  public addTeachers(teachers: ITeacher[]): any {
    return Promise.all(
      teachers.map(teacher => {
        this.http
          .post<ITeacher[]>(`/api/register`, teacher, HTTP_OPTIONS)
          .pipe(catchError(this.handleError))
          .toPromise();
      })
    );
  }

  public deleteTeachers(teachersIds: Set<number>): Promise<{ result: number }> {
    let urlParams: string = '';
    teachersIds.forEach(id => {
      urlParams += `id=${id}&`;
    });
    urlParams = urlParams.substring(0, urlParams.length - 1);
    return this.http
      .delete<{ result: number }>(`${TEACHERS}/delete?${urlParams}`, HTTP_OPTIONS)
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

  private extractData(res: { result: ITeacher[] }): { result: ITeacher[] } {
    return res || { result: [] };
  }
}
