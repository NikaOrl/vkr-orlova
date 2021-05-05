import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { Observable, of } from 'rxjs';

import { MarksApiService } from './marks-api.service';
import { IJob } from '../models/job.model';
import { IMark } from '../models/mark.model';
import {
  IAttendancesTableData,
  IAttendancesTableDataAttendance,
  ITableDataFromBE,
  ITableDataJob,
  ITableDataStudent,
} from '../models/table-data.model';
import { DISCIPLINES, JOBS, MARKS } from '../../core/http-constants';
import { IDiscipline } from '../../disciplines/models/discipline.model';
import { IMarksModule } from '../models/module-jobs.model';
import { IModule } from '../models/module.model';

export const mockAttendance: IAttendancesTableData = {
  students: [
    {
      id: '0',
      firstName: 'Ivan',
      lastName: 'Ivanov',
      numberInList: 1,
      email: 'ivan@stud.com',
      groupId: '1',
      headStudent: true,
      deleted: false,
    },
  ],
  attendances: [
    {
      id: '0',
      disciplineId: '0',
      attendanceName: '01/01',
      deleted: false,
      numberInList: 0,
      attendanceMarks: [{ id: '0', studentId: '0', attendanceId: '0', attendanceMarkValue: true, deleted: false }],
    },
    {
      id: '1',
      disciplineId: '1',
      attendanceName: '02/01',
      deleted: false,
      numberInList: 1,
      attendanceMarks: [{ id: '3', studentId: '0', attendanceId: '1', attendanceMarkValue: false, deleted: false }],
    },
  ],
};

export class MarksApiServiceStub {
  public getMarks(disciplineId: number, groupId: number): Observable<ITableDataFromBE> {
    return of({
      jobs: [
        {
          id: '1',
          jobValue: '1',
          moduleId: '1',
          deleted: false,
          marks: [
            { id: '1', markValue: '1', studentId: '1' } as IMark,
            { id: '2', markValue: '2', studentId: '2' } as IMark,
          ],
        } as ITableDataJob,
        {
          id: '2',
          jobValue: '2',
          moduleId: '1',
          deleted: false,
          marks: [
            { id: '1', markValue: '1', studentId: '1' } as IMark,
            { id: '2', markValue: '2', studentId: '2' } as IMark,
          ],
        } as ITableDataJob,
      ],
      students: [{ id: '1' } as ITableDataStudent, { id: '2' } as ITableDataStudent],
      modules: [{ id: '1' } as IModule],
      maxAttendance: 10,
      attendanceWeight: 10,
      countWithAttendance: false,
    });
  }

  public getAttendanceMarks(disciplineId: number, groupId: number): Observable<IAttendancesTableData> {
    return of(mockAttendance);
  }

  public updateAttendances(attendances: IAttendancesTableDataAttendance[]): Observable<{ status: string }> {
    return of({ status: 'test' });
  }

  public getModulesAndGroups(disciplineId: string, groupId: string): Observable<IMarksModule[]> {
    return of([]);
  }

  public getDisciplines(): Observable<IDiscipline[]> {
    return of([{ id: '1' } as IDiscipline, { id: '2' } as IDiscipline]);
  }

  public getGroups(): Observable<unknown> {
    return of([
      { id: 1, groupNumber: 1 },
      { id: 2, groupNumber: 2 },
    ]);
  }

  public updateMarks(marks: IMark[]): Observable<{ result: IMark[] }> {
    return of({ result: [{ id: '1' } as IMark, { id: '2' } as IMark] });
  }

  public updateJobs(jobs: IJob[]): Observable<{ result: IJob[] }> {
    return of({ result: [{ id: '1' } as IJob, { id: '2' } as IJob] });
  }

  public addJobsAndMarks(jobs: IJob[], marks: IMark[]): Promise<{ result: IMark[] }> {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve({ result: [{ id: '1' } as IMark, { id: '2' } as IMark] }));
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
    const dummyUsers: ITableDataFromBE = {
      students: [],
      jobs: [{ marks: [{ id: '1', jobId: '0' } as IMark, { id: '1', jobId: '0' } as IMark] }],
      modules: [],
    } as ITableDataFromBE;

    service.getMarks('1', '1').subscribe(users => {
      expect(users.jobs.length).toBe(1);
      expect(users).toEqual(dummyUsers);
    });

    const req: TestRequest = httpMock.expectOne(`${MARKS}?groupId=1&disciplineId=1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyUsers);
  });

  it('should getDisciplines', () => {
    const dummyUsers: IDiscipline[] = [{ id: '1' } as IDiscipline, { id: '2' } as IDiscipline];

    service.getDisciplines().subscribe(users => {
      expect(users.length).toBe(2);
      expect(users).toEqual(dummyUsers);
    });

    const req: TestRequest = httpMock.expectOne(`${DISCIPLINES}`);
    expect(req.request.method).toBe('GET');
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
});
