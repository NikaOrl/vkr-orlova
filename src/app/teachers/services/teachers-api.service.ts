import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Teacher } from '../models/teacher.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
const apiUrl = '/api/teachers';

@Injectable({
  providedIn: 'root',
})
export class TeachersApiService {
  constructor(private http: HttpClient) {}

  public getTeachers(): Promise<any> {
    return this.http
      .get(`${apiUrl}`, httpOptions)
      .pipe(map(this.extractData), catchError(this.handleError))
      .toPromise();
  }

  public updateTeachers(teachers: Teacher[]): Promise<any> {
    return this.http
      .put<Teacher[]>(`${apiUrl}/update`, teachers, httpOptions)
      .pipe(catchError(this.handleError))
      .toPromise();
  }

  public addTeachers(teachers: Teacher[]): Promise<any> {
    return Promise.all(
      teachers.map(teacher => {
        this.http.post<Teacher[]>(`/api/register`, teacher, httpOptions).pipe(catchError(this.handleError)).toPromise();
      })
    );
  }

  public deleteTeachers(teachersIds: Set<number>): Promise<any> {
    let urlParams = '';
    teachersIds.forEach(id => {
      urlParams += 'id=' + id + '&';
    });
    urlParams = urlParams.substring(0, urlParams.length - 1);
    return this.http
      .delete(`${apiUrl}/delete?${urlParams}`, httpOptions)
      .pipe(catchError(this.handleError))
      .toPromise();
  }

  private handleError(error: HttpErrorResponse) {
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

  private extractData(res: Response) {
    const body = res;
    return body || {};
  }
}
