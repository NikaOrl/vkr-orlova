import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { IJob } from '../models/jobs.model';
import { IMark } from '../models/marks.model';
import { DISCIPLINES, GROUPS, HTTP_OPTIONS, JOBS, MARKS } from '../../core/http-constants';
import { IDiscipline } from '../models/discipline.model';
import { ITableData } from '../models/table-data.model';
import { IGroup } from 'src/app/groups/models/group.model';

@Injectable({
  providedIn: 'root',
})
export class MarksApiService {
  constructor(private http: HttpClient) {}

  public getMarks(disciplineId: number, groupId: number): Promise<ITableData> {
    return this.http
      .get<ITableData>(`${MARKS}`, {
        ...HTTP_OPTIONS,
        params: {
          groupId: groupId.toString(),
          disciplineId: disciplineId.toString(),
        }
      })
      .pipe(map(this.extractData), catchError(this.handleError))
      .toPromise();
  }

  public getDisciplines(): Observable<IDiscipline[]> {
    return this.http
      .get<IDiscipline[]>(`${DISCIPLINES}`, HTTP_OPTIONS)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  public getGroups(): Observable<IGroup[]> {
    return this.http
      .get<IGroup[]>(`${GROUPS}`, HTTP_OPTIONS)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  public updateMarks(marks: IMark[]): Promise<{ status: string }> {
    return this.http
      .put<{ status: string }>(`${MARKS}`, marks, HTTP_OPTIONS)
      .pipe(catchError(this.handleError))
      .toPromise();
  }

  public updateJobs(jobs: IJob[]): Promise<{ status: string }> {
    return this.http
      .put<{ status: string }>(`${JOBS}`, jobs, HTTP_OPTIONS)
      .pipe(catchError(this.handleError))
      .toPromise();
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
          .post<number[]>(`${JOBS}`, job, HTTP_OPTIONS)
          .pipe(catchError(this.handleError))
          .toPromise()
          .then(result => {
            if (result) {
              const jobId: number = +result[0];

            jobMarks.forEach(mark => {
              mark.jobId = jobId;
              return mark;
            });
            this.http
              .post<number[]>(`${JOBS}`, jobMarks, HTTP_OPTIONS)
              .pipe(catchError(this.handleError))
              .toPromise();
              jobMarks.forEach(mark => {
                mark.jobId = jobId;
                return mark;
              });
              this.http
                .post<number[]>(`/api/marks/add`, jobMarks, HTTP_OPTIONS)
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
      this.http.delete(`${MARKS}`, {
        ...HTTP_OPTIONS,
        params: {
          ids: [...jobsIds].map(id => id.toString()),
        }
      }).pipe(catchError(this.handleError)).toPromise(),
      this.http.delete(`${JOBS}`, {
        ...HTTP_OPTIONS,
        params: {
          ids: [...jobsIds].map(id => id.toString()),
        }
      }).pipe(catchError(this.handleError)).toPromise(),
    ]);
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
  private extractData(res: ITableData | IDiscipline[] | IGroup[]): any {
    return res || [];
  }
}
