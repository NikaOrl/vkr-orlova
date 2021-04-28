import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';

import { TeachersApiService } from './teachers-api.service';
import { ITeacher } from '../models/teacher.model';
import { TEACHERS } from '../../core/http-constants';
import { Observable, of } from 'rxjs';

export class TeachersApiServiceStub {
  public getTeachers(): Observable<ITeacher[]> {
    return of([{ id: '1' } as ITeacher, { id: '2' } as ITeacher]);
  }

  public updateTeachers(teachers: ITeacher[]): Observable<{ status: string }> {
    return of({ status: 'test' });
  }

  // tslint:disable-next-line: no-any
  public addTeachers(teachers: ITeacher[]): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve('test'));
      setTimeout(() => reject(new Error('ignored')));
    });
  }

  public deleteTeachers(teachersIds: Set<number>): Observable<number> {
    return of(1);
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
    const dummyUsers: ITeacher[] = [{ lastName: 'John' } as ITeacher, { lastName: 'Doe' } as ITeacher];

    service.getTeachers().subscribe(users => {
      expect(users.length).toBe(2);
      expect(users).toEqual(dummyUsers);
    });

    const req: TestRequest = httpMock.expectOne(`${TEACHERS}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyUsers);
  });

  it('should updateTeachers', () => {
    const dummyUsers: { status: string } = { status: 'success' };

    service.updateTeachers([]).subscribe(users => {
      expect(users).toEqual(dummyUsers);
    });

    const req: TestRequest = httpMock.expectOne(`${TEACHERS}`);
    expect(req.request.method).toBe('PUT');
    req.flush(dummyUsers);
  });

  it('should addTeachers', () => {
    const dummyUsers: ITeacher[] = [{ lastName: '1' } as ITeacher];

    service.addTeachers(([{ first: '1' }] as unknown) as ITeacher[]).then(users => {
      expect(users.length).toBe(1);
    });

    const req: TestRequest = httpMock.expectOne(`${TEACHERS}`);
    expect(req.request.method).toBe('POST');
    req.flush(dummyUsers);
  });

  it('should deleteTeachers', () => {
    const dummyUsers: number = 2;

    service.deleteTeachers(new Set(['1', '2'])).subscribe(users => {
      expect(users).toEqual(dummyUsers);
    });

    const req: TestRequest = httpMock.expectOne(`${TEACHERS}?ids=1&ids=2`);
    expect(req.request.method).toBe('DELETE');
    req.flush(dummyUsers);
  });
});
