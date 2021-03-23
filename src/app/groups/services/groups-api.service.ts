import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Student } from '../models/student.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
const apiUrl = '/api/students';

@Injectable({
  providedIn: 'root',
})
export class GroupsApiService {
  constructor(private http: HttpClient) {}

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

  getStudents(groupId: number): Promise<any> {
    return this.http
      .get(`${apiUrl}/group/${groupId}`, httpOptions)
      .pipe(map(this.extractData), catchError(this.handleError))
      .toPromise();
  }

  getGroups(): Promise<any> {
    return this.http
      .get(`${apiUrl}/groups`, httpOptions)
      .pipe(map(this.extractData), catchError(this.handleError))
      .toPromise();
  }

  updateStudents(students: Student[]): Promise<any> {
    return this.http
      .put<Student[]>(`${apiUrl}/update`, students, httpOptions)
      .pipe(catchError(this.handleError))
      .toPromise();
  }

  addStudents(students: Student[]): Promise<any> {
    return this.http
      .post<Student[]>(`${apiUrl}/add`, students, httpOptions)
      .pipe(catchError(this.handleError))
      .toPromise();
  }

  deleteStudents(studentsIds: Set<number>): Promise<any> {
    let urlParams = '';
    studentsIds.forEach(id => {
      urlParams += 'id=' + id + '&';
    });
    urlParams = urlParams.substring(0, urlParams.length - 1);
    return this.http
      .delete(`${apiUrl}/delete?${urlParams}`, httpOptions)
      .pipe(catchError(this.handleError))
      .toPromise();
  }
}
