import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { TeachersApiService } from './teachers-api.service';
import { Teacher } from '../models/teacher.model';

const apiUrl = '/api/teachers';

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
    service = injector.get(TeachersApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should getTeachers', () => {
    const dummyUsers = [{ login: 'John' }, { login: 'Doe' }];

    service.getTeachers().then(users => {
      expect(users.length).toBe(2);
      expect(users).toEqual(dummyUsers);
    });

    const req = httpMock.expectOne(`${apiUrl}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyUsers);
  });

  it('should updateTeachers', () => {
    const dummyUsers = [{ first: '1' }, { second: '2' }];

    service.updateTeachers([]).then(users => {
      expect(users.length).toBe(2);
      expect(users).toEqual(dummyUsers);
    });

    const req = httpMock.expectOne(`${apiUrl}/update`);
    expect(req.request.method).toBe('PUT');
    req.flush(dummyUsers);
  });

  it('should addTeachers', () => {
    const dummyUsers = [{ first: '1' }];

    service.addTeachers(([{ first: '1' }] as unknown) as Teacher[]).then(users => {
      expect(users.length).toBe(1);
    });

    const req = httpMock.expectOne(`/api/register`);
    expect(req.request.method).toBe('POST');
    req.flush(dummyUsers);
  });

  it('should deleteTeachers', () => {
    const dummyUsers = [{ first: '1' }, { second: '2' }];

    service.deleteTeachers(new Set([1, 2])).then(users => {
      expect(users.length).toBe(2);
      expect(users).toEqual(dummyUsers);
    });

    const req = httpMock.expectOne(`${apiUrl}/delete?id=1&id=2`);
    expect(req.request.method).toBe('DELETE');
    req.flush(dummyUsers);
  });
});
