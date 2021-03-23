import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Jobs } from '../models/jobs.model';
import { Marks } from '../models/marks.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
const apiUrl = '/api/marks';

@Injectable({
  providedIn: 'root',
})
export class MarksApiService {
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

  getMarks(disciplineId: number): Promise<any> {
    return this.http
      .get(`${apiUrl}/discipline/${disciplineId}`, httpOptions)
      .pipe(map(this.extractData), catchError(this.handleError))
      .toPromise();
  }

  getDisciplines(): Promise<any> {
    return this.http
      .get(`${apiUrl}/disciplines`, httpOptions)
      .pipe(map(this.extractData), catchError(this.handleError))
      .toPromise();
  }

  updateMarks(marks: Marks[]): Promise<any> {
    return this.http.put<any[]>(`${apiUrl}/update`, marks, httpOptions).pipe(catchError(this.handleError)).toPromise();
  }

  updateJobs(jobs: Jobs[]): Promise<any> {
    return this.http.put<any[]>(`/api/jobs/update`, jobs, httpOptions).pipe(catchError(this.handleError)).toPromise();
  }

  addJobsAndMarks(jobs: Jobs[], marks: Marks[]): Promise<any> {
    return Promise.all([
      jobs.forEach(job => {
        const jobMarks = [];
        marks.forEach(mark => {
          if (mark.jobId === job.id) {
            jobMarks.push(mark);
          }
        });
        job.id = null;
        this.http
          .post<any[]>(`/api/jobs/add`, job, httpOptions)
          .pipe(catchError(this.handleError))
          .toPromise()
          .then(result => {
            const jobId = JSON.parse(JSON.stringify(result)).result[0];
            jobMarks.forEach(mark => {
              mark.jobId = jobId;
              return mark;
            });
            this.http
              .post<any[]>(`/api/marks/add`, jobMarks, httpOptions)
              .pipe(catchError(this.handleError))
              .toPromise();
          });
      }),
    ]);
  }

  deleteJobs(jobsIds: Set<number>): Promise<any> {
    let urlParams = '';
    jobsIds.forEach(id => {
      urlParams += 'id=' + id + '&';
    });
    urlParams = urlParams.substring(0, urlParams.length - 1);
    return Promise.all([
      this.http.delete(`${apiUrl}/delete?${urlParams}`, httpOptions).pipe(catchError(this.handleError)).toPromise(),
      this.http.delete(`/api/jobs/delete?${urlParams}`, httpOptions).pipe(catchError(this.handleError)).toPromise(),
    ]);
  }
}
