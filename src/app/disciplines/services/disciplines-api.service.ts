import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { DISCIPLINES, HTTP_OPTIONS, SEMESTERS, TEACHERS } from '../../core/http-constants';
import { IDiscipline, IDisciplineBase } from '../models/discipline.model';
import { IDisciplineGroup } from '../models/group-students.model';
import { ITeacher } from '../../teachers/models/teacher.model';
import { ISemester, ISemesterBase } from '../models/semester.model';

const mockSemesters: ISemester[] = [
  { semesterName: 'Весна 2020', id: '0' },
  { semesterName: 'Осень 2020', id: '1' },
  { semesterName: 'Весна 2021', id: '2' },
  { semesterName: 'Осень 2021', id: '3' },
];
@Injectable({
  providedIn: 'root',
})
export class DisciplinesApiService {
  constructor(private http: HttpClient) {}

  public getSemesters(): Observable<ISemester[]> {
    return of(mockSemesters);
    // return this.http
    //   .get<ISemester[]>(`${SEMESTERS}`, HTTP_OPTIONS)
    //   .pipe(map(this.extractData), catchError(this.handleError));
  }

  public getDisciplines(semesterId: string): Observable<IDiscipline[]> {
    return this.http
      .get<IDiscipline[]>(`${DISCIPLINES}`, {
        ...HTTP_OPTIONS,
        params: {
          semesterId: `${semesterId}`,
        },
      })
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  public getTeachers(): Observable<ITeacher[]> {
    return this.http
      .get<ITeacher[]>(`${TEACHERS}`, HTTP_OPTIONS)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  public getGroupsAndStudents(disciplineId: string): Observable<IDisciplineGroup[]> {
    return this.http
      .get<IDisciplineGroup[]>(`${DISCIPLINES}/${disciplineId}/students`, HTTP_OPTIONS)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  public updateGroupsAndStudents(
    disciplineId: string,
    groupsAndStudentsData: IDisciplineGroup[]
  ): Observable<{ status: string }> {
    return this.http
      .put<{ status: string }>(`${DISCIPLINES}/${disciplineId}/students`, groupsAndStudentsData, HTTP_OPTIONS)
      .pipe(catchError(this.handleError));
  }

  public updateDiscipline(discipline: IDiscipline): Observable<{ status: string }> {
    return this.http
      .put<{ status: string }>(`${DISCIPLINES}/${discipline.id}`, discipline, HTTP_OPTIONS)
      .pipe(catchError(this.handleError));
  }

  public addDiscipline(discipline: IDisciplineBase): Observable<number[]> {
    return this.http.post<number[]>(`${DISCIPLINES}`, discipline, HTTP_OPTIONS).pipe(catchError(this.handleError));
  }

  public addSemester(semester: ISemesterBase): Observable<number[]> {
    return this.http.post<number[]>(`${SEMESTERS}`, semester, HTTP_OPTIONS).pipe(catchError(this.handleError));
  }

  public deleteDiscipline(disciplineId: string): Observable<number> {
    return this.http.delete<number>(`${DISCIPLINES}/${disciplineId}`, HTTP_OPTIONS).pipe(catchError(this.handleError));
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
