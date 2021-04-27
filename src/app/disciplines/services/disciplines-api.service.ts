import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { DISCIPLINE, HTTP_OPTIONS, MARKS, TEACHERS } from '../../core/http-constants';
import { IDiscipline } from '../models/discipline.model';
import { IDisciplineGroup } from '../models/group-students.model';
import { ITeacher } from '../../teachers/models/teacher.model';

const mockGroupStudents: IDisciplineGroup[] = [
  {
    id: 1,
    groupNumber: 5381,
    students: [
      {
        id: 1,
        firstName: 'Ivan',
        lastName: 'Ivanov',
        groupId: 1,
        isInDiscipline: false,
      },
      {
        id: 2,
        firstName: 'Petr',
        lastName: 'Petrov',
        groupId: 1,
        isInDiscipline: true,
      },
      {
        id: 3,
        firstName: 'Vasia',
        lastName: 'Vasiliev',
        groupId: 1,
        isInDiscipline: true,
      },
      {
        id: 5,
        firstName: 'Tolya',
        lastName: 'Popov',
        groupId: 1,
        isInDiscipline: true,
      },
      {
        id: 6,
        firstName: 'Andrei',
        lastName: 'Markoff',
        groupId: 1,
        isInDiscipline: true,
      },
      {
        id: 7,
        firstName: 'Sachar',
        lastName: 'Dobrow',
        groupId: 1,
        isInDiscipline: true,
      },
      {
        id: 8,
        firstName: 'Kostya',
        lastName: 'Levitsky',
        groupId: 1,
        isInDiscipline: true,
      },
      {
        id: 9,
        firstName: 'Kolya',
        lastName: 'Morein',
        groupId: 1,
        isInDiscipline: true,
      },
      {
        id: 10,
        firstName: 'Anton',
        lastName: 'Markov',
        groupId: 1,
        isInDiscipline: true,
      },
      {
        id: 11,
        firstName: 'Stenya',
        lastName: 'Polakoff',
        groupId: 1,
        isInDiscipline: true,
      },
    ],
  },
  {
    id: 2,
    groupNumber: 5382,
    students: [
      {
        id: 2,
        firstName: 'Ivan',
        lastName: 'Ivanov',
        groupId: 2,
        isInDiscipline: false,
      },
      {
        id: 2,
        firstName: 'Petr',
        lastName: 'Petrov',
        groupId: 2,
        isInDiscipline: false,
      },
      {
        id: 3,
        firstName: 'Vasia',
        lastName: 'Vasiliev',
        groupId: 2,
        isInDiscipline: false,
      },
      {
        id: 5,
        firstName: 'Tolya',
        lastName: 'Popov',
        groupId: 2,
        isInDiscipline: true,
      },
      {
        id: 6,
        firstName: 'Andrei',
        lastName: 'Markoff',
        groupId: 2,
        isInDiscipline: true,
      },
    ],
  },
];

@Injectable({
  providedIn: 'root',
})
export class DisciplinesApiService {
  constructor(private http: HttpClient) {}

  public getDisciplines(): Observable<IDiscipline[]> {
    return this.http
      .get<{ result: IDiscipline[] }>(`${MARKS}/disciplines`, HTTP_OPTIONS)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  public getTeachers(): Observable<ITeacher[]> {
    return this.http
      .get<{ result: ITeacher[] }>(`${TEACHERS}`, HTTP_OPTIONS)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  public getGroupsAndStudents(disciplineId: number): Observable<IDisciplineGroup[]> {
    // return this.http
    //   .get<{ result: IDisciplineGroup[] }>(`${DISCIPLINE}/${disciplineId}/students`, HTTP_OPTIONS)
    //   .pipe(map(this.extractData), catchError(this.handleError));
    return of(mockGroupStudents);
  }

  public updateGroupsAndStudents(
    disciplineId: number,
    groupsAndStudentsData: IDisciplineGroup[]
  ): Observable<{ status: string }> {
    return this.http
      .put<{ status: string }>(`${DISCIPLINE}/${disciplineId}/students`, groupsAndStudentsData, HTTP_OPTIONS)
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
  private extractData<Type>(res: { result: Type[] }): Type[] {
    return res.result || [];
  }
}
