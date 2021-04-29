import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { IJob } from '../models/jobs.model';
import { IMark } from '../models/marks.model';
import { HTTP_OPTIONS, MARKS, GROUPS, DISCIPLINES, JOBS } from '../../core/http-constants';
import { ITableData, ITableDataFromBE } from '../models/table-data.model';
import { IGroup } from '../../groups/models/group.model';
import { IDiscipline } from '../../disciplines/models/discipline.model';
import { IMarksModule } from '../models/module-jobs.model';

const mockModulesJobs: IMarksModule[] = [
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

  public updateMarks(marks: IMark[]): Observable<{ status: string }> {
    return this.http.put<{ status: string }>(`${MARKS}`, marks, HTTP_OPTIONS).pipe(catchError(this.handleError));
  }

  public updateJobs(jobs: IJob[]): Observable<{ status: string }> {
    return this.http.put<{ status: string }>(`${JOBS}`, jobs, HTTP_OPTIONS).pipe(catchError(this.handleError));
  }

  public addJobsAndMarks(jobs: IJob[], marks: IMark[]): Promise<void[]> {
    return Promise.all([
      jobs.forEach(job => {
        const jobMarks: IMark[] = [];
        marks.forEach(mark => {
          if (mark.jobId === job.id) {
            jobMarks.push(mark);
          }
        });
        job.id = null;
        this.http
          .post<string[]>(`${JOBS}`, job, HTTP_OPTIONS)
          .pipe(catchError(this.handleError))
          .toPromise()
          .then(result => {
            if (result) {
              const jobId: string = result[0];

              jobMarks.forEach(mark => {
                mark.jobId = jobId;
                return mark;
              });
              this.http
                .post<number[]>(`${MARKS}`, jobMarks, HTTP_OPTIONS)
                .pipe(catchError(this.handleError))
                .toPromise();
            }
          });
      }),
    ]);
  }

  // tslint:disable-next-line: no-any
  public deleteJobs(jobsIds: Set<number>): Promise<any> {
    return Promise.all([
      this.http
        .delete(`${MARKS}`, {
          ...HTTP_OPTIONS,
          params: {
            ids: [...jobsIds].map(id => id.toString()),
          },
        })
        .pipe(catchError(this.handleError))
        .toPromise(),
      this.http
        .delete(`${JOBS}`, {
          ...HTTP_OPTIONS,
          params: {
            ids: [...jobsIds].map(id => id.toString()),
          },
        })
        .pipe(catchError(this.handleError))
        .toPromise(),
    ]);
  }

  public getModulesAndGroups(disciplineId: string, groupId: string): Observable<IMarksModule[]> {
    // return this.http
    //   .get<IMarksModule[]>(`${MARKS}/${disciplineId}/${groupId}/jobs`, HTTP_OPTIONS)
    //   .pipe(map(this.extractData), catchError(this.handleError));
    return of(mockModulesJobs);
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
