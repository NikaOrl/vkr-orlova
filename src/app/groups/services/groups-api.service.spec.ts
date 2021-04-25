import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';

import { GroupsApiService } from './groups-api.service';
import { IStudent } from '../models/student.model';
import { IGroup } from '../models/group.model';
import { GROUPS, STUDENTS } from '../../core/http-constants';
import { Observable, of } from 'rxjs';

export class GroupsApiServiceStub {
  public getStudents(groupId: number): Promise<unknown> {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve([{ id: 1 }, { id: 2 }]));
      setTimeout(() => reject(new Error('ignored')));
    });
  }

  public getGroups(): Observable<unknown> {
    return of([
      { id: 1, groupNumber: 1 },
      { id: 2, groupNumber: 2 },
    ]);
  }

  public updateStudents(students: IStudent[]): Promise<unknown> {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve('groups'));
      setTimeout(() => reject(new Error('ignored')));
    });
  }

  public addStudents(students: IStudent[]): Promise<unknown> {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve('groups'));
      setTimeout(() => reject(new Error('ignored')));
    });
  }

  public deleteStudents(studentsIds: Set<number>): Promise<unknown> {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve('groups'));
      setTimeout(() => reject(new Error('ignored')));
    });
  }
}

describe('GroupsApiService', () => {
  let injector: TestBed;
  let service: GroupsApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GroupsApiService],
    });
    injector = getTestBed();
    service = TestBed.inject(GroupsApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should getStudents', () => {
    const dummyUsers: IStudent[] = [{ lastName: 'John' } as IStudent, { lastName: 'Doe' } as IStudent];

    service.getStudents(1).then(users => {
      expect(users.length).toBe(2);
      expect(users).toEqual(dummyUsers);
    });

    const req: TestRequest = httpMock.expectOne(`${STUDENTS}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyUsers);
  });

  it('should getGroups', () => {
    const dummyUsers: IGroup[] = [{ id: 1 } as IGroup, { id: 2 } as IGroup];

    service.getGroups().subscribe(users => {
      expect(users.length).toBe(2);
      expect(users).toEqual(dummyUsers);
    });

    const req: TestRequest = httpMock.expectOne(`${GROUPS}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyUsers);
  });

  it('should updateStudents', () => {
    const status: { status: string } = { status: 'success' };

    service.updateStudents([]).then(users => {
      expect(users).toEqual(status);
    });

    const req: TestRequest = httpMock.expectOne(`${STUDENTS}`);
    expect(req.request.method).toBe('PUT');
    req.flush(status);
  });

  it('should addStudents', () => {
    const dummyUsers: number[] = [1, 2];

    service.addStudents([]).then(users => {
      expect(users.length).toBe(2);
      expect(users).toEqual(dummyUsers);
    });

    const req: TestRequest = httpMock.expectOne(`${STUDENTS}`);
    expect(req.request.method).toBe('POST');
    req.flush(dummyUsers);
  });

  it('should deleteStudents', () => {
    service.deleteStudents(new Set([1, 2])).then(users => {
      expect(users).toEqual(2);
    });

    const req: TestRequest = httpMock.expectOne(`${STUDENTS}?ids=1&ids=2`);
    expect(req.request.method).toBe('DELETE');
    req.flush(2);
  });
});
