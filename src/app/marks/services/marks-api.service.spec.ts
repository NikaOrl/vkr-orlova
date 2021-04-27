import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { Observable, of } from 'rxjs';

import { MarksApiService } from './marks-api.service';
import { IJob } from '../models/jobs.model';
import { IMark } from '../models/marks.model';
import { ITableData } from '../models/table-data.model';
import { IStudent } from '../../groups/models/student.model';
import { DISCIPLINES, JOBS, MARKS } from '../../core/http-constants';
import { IDiscipline } from '../../disciplines/models/discipline.model';

export class MarksApiServiceStub {
  public getMarks(disciplineId: number, groupId: number): Observable<ITableData> {
    return of({
      marks: [{ id: 1, markValue: '1' } as IMark, { id: 2, markValue: '2' } as IMark],
      jobs: [{ id: 1, jobValue: '1' } as IJob, { id: 2, jobValue: '2' } as IJob],
      students: [{ id: 1 } as IStudent, { id: 2 } as IStudent],
    });
  }

  public getDisciplines(): Observable<IDiscipline[]> {
    return of([{ id: 1 } as IDiscipline, { id: 2 } as IDiscipline]);
  }

  public getGroups(): Observable<unknown> {
    return of([
      { id: 1, groupNumber: 1 },
      { id: 2, groupNumber: 2 },
    ]);
  }

  public updateMarks(marks: IMark[]): Observable<{ result: IMark[] }> {
    return of({ result: [{ id: 1 } as IMark, { id: 2 } as IMark] });
  }

  public updateJobs(jobs: IJob[]): Observable<{ result: IJob[] }> {
    return of({ result: [{ id: 1 } as IJob, { id: 2 } as IJob] });
  }

  public addJobsAndMarks(jobs: IJob[], marks: IMark[]): Promise<{ result: IMark[] }> {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve({ result: [{ id: 1 } as IMark, { id: 2 } as IMark] }));
      setTimeout(() => reject(new Error('ignored')));
    });
  }

  public deleteJobs(jobsIds: Set<number>): Promise<{ result: number }> {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve({ result: 2 }));
      setTimeout(() => reject(new Error('ignored')));
    });
  }
}

describe('MarksApiService', () => {
  let injector: TestBed;
  let service: MarksApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MarksApiService],
    });
    injector = getTestBed();
    service = TestBed.inject(MarksApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should getMarks', () => {
    const dummyUsers: ITableData = { marks: [{ id: 1 } as IMark, { id: 1 } as IMark] } as ITableData;

    service.getMarks(1, 1).subscribe(users => {
      expect(users.marks.length).toBe(2);
      expect(users).toEqual(dummyUsers);
    });

    const req: TestRequest = httpMock.expectOne(`${MARKS}?groupId=1&disciplineId=1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyUsers);
  });

  it('should getDisciplines', () => {
    const dummyUsers: IDiscipline[] = [{ id: 1 } as IDiscipline, { id: 2 } as IDiscipline];

    service.getDisciplines().subscribe(users => {
      expect(users.length).toBe(2);
      expect(users).toEqual(dummyUsers);
    });

    const req: TestRequest = httpMock.expectOne(`${DISCIPLINES}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyUsers);
  });

  it('should updateMarks', () => {
    const dummyUsers: { status: string } = { status: 'success' };

    service.updateMarks([]).subscribe(users => {
      expect(users).toEqual(dummyUsers);
    });

    const req: TestRequest = httpMock.expectOne(`${MARKS}`);
    expect(req.request.method).toBe('PUT');
    req.flush(dummyUsers);
  });

  it('should updateJobs', () => {
    const dummyUsers: { status: string } = { status: 'success' };

    service.updateJobs([]).subscribe(users => {
      expect(users).toEqual(dummyUsers);
    });

    const req: TestRequest = httpMock.expectOne(`${JOBS}`);
    expect(req.request.method).toBe('PUT');
    req.flush(dummyUsers);
  });

  it('should addJobsAndMarks', () => {
    const dummyUsers: IJob[] = [{ id: 1 } as IJob, { id: 2 } as IJob];

    service.addJobsAndMarks(
      ([{ id: 1, first: '1' }] as unknown) as IJob[],
      ([
        { jobId: 1, first: '1' },
        { jobId: 1, second: '2' },
      ] as unknown) as IMark[]
    );
    const req2: TestRequest = httpMock.expectOne(`${JOBS}`);
    expect(req2.request.method).toBe('POST');
    req2.flush(dummyUsers);
  });

  it('should deleteStudents', () => {
    const dummyUsers: number = 2;

    service.deleteJobs(new Set([1, 2])).then(users => {
      expect(users).toBe(2);
    });

    const req: TestRequest = httpMock.expectOne(`${JOBS}?ids=1&ids=2`);
    const req2: TestRequest = httpMock.expectOne(`${MARKS}?ids=1&ids=2`);
    expect(req.request.method).toBe('DELETE');
    expect(req2.request.method).toBe('DELETE');
    req.flush(dummyUsers);
  });
});
