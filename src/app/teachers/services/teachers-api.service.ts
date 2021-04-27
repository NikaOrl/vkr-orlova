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

  public getTeachers(): Observable<ITeacher[]> {
    return this.http
      .get<ITeacher[]>(`${TEACHERS}`, HTTP_OPTIONS)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  public updateTeachers(teachers: ITeacher[]): Observable<{ status: string }> {
    return this.http.put<{ status: string }>(`${TEACHERS}`, teachers, HTTP_OPTIONS).pipe(catchError(this.handleError));
  }

  // tslint:disable-next-line: no-any
  public addTeachers(teachers: ITeacher[]): any {
    return Promise.all(
      teachers.map(teacher => {
        this.http.post<ITeacher[]>(`${TEACHERS}`, teacher, HTTP_OPTIONS).pipe(catchError(this.handleError)).toPromise();
      })
    );
  }

  public deleteTeachers(teachersIds: Set<number>): Observable<number> {
    return this.http
      .delete<number>(`${TEACHERS}`, {
        ...HTTP_OPTIONS,
        params: {
          ids: [...teachersIds].map(id => id.toString()),
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

  private extractData(res: ITeacher[]): ITeacher[] {
    return res || [];
  }
}
