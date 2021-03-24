import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';

import { TeachersApiService } from './teachers-api.service';
import { ITeacher } from '../models/teacher.model';
import { TEACHERS } from '../../core/http-constants';

export class TeachersApiServiceStub {
  public getTeachers(): Promise<{ result: ITeacher[] }> {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve({ result: [{ id: 1 } as ITeacher, { id: 2 } as ITeacher] }));
      setTimeout(() => reject(new Error('ignored')));
    });
  }

  public updateTeachers(teachers: ITeacher[]): Promise<{ status: string }> {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve({ status: 'test' }));
      setTimeout(() => reject(new Error('ignored')));
    });
  }

  // tslint:disable-next-line: no-any
  public addTeachers(teachers: ITeacher[]): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve({ result: 'test' }));
      setTimeout(() => reject(new Error('ignored')));
    });
  }

  public deleteTeachers(teachersIds: Set<number>): Promise<{ result: number }> {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve({ result: 1 }));
      setTimeout(() => reject(new Error('ignored')));
    });
  }
}

describe('TeachersApiService', () => {
  let injector: TestBed;
  let service: TeachersApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TeachersApiService],
    });
    injector = getTestBed();
    service = TestBed.inject(TeachersApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should getTeachers', () => {
    const dummyUsers: { result: ITeacher[] } = {
      result: [{ lastName: 'John' } as ITeacher, { lastName: 'Doe' } as ITeacher],
    };

    service.getTeachers().then(users => {
      expect(users.result.length).toBe(2);
      expect(users).toEqual(dummyUsers);
    });

    const req: TestRequest = httpMock.expectOne(`${TEACHERS}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyUsers);
  });

  it('should updateTeachers', () => {
    const dummyUsers: { status: string } = { status: 'success' };

    service.updateTeachers([]).then(users => {
      expect(users).toEqual(dummyUsers);
    });

    const req: TestRequest = httpMock.expectOne(`${TEACHERS}/update`);
    expect(req.request.method).toBe('PUT');
    req.flush(dummyUsers);
  });

  it('should addTeachers', () => {
    const dummyUsers: ITeacher[] = [{ lastName: '1' } as ITeacher];

    service.addTeachers(([{ first: '1' }] as unknown) as ITeacher[]).then(users => {
      expect(users.length).toBe(1);
    });

    const req: TestRequest = httpMock.expectOne(`/api/register`);
    expect(req.request.method).toBe('POST');
    req.flush(dummyUsers);
  });

  it('should deleteTeachers', () => {
    const dummyUsers: { result: number } = { result: 2 };

    service.deleteTeachers(new Set([1, 2])).then(users => {
      expect(users).toEqual(dummyUsers);
    });

    const req: TestRequest = httpMock.expectOne(`${TEACHERS}/delete?id=1&id=2`);
    expect(req.request.method).toBe('DELETE');
    req.flush(dummyUsers);
  });
});
