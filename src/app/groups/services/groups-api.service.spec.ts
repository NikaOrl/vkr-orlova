import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { GroupsApiService } from './groups-api.service';

const apiUrl = '/api/students';

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
    service = injector.get(GroupsApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should getStudents', () => {
    const dummyUsers = [{ login: 'John' }, { login: 'Doe' }];

    service.getStudents(1).then(users => {
      expect(users.length).toBe(2);
      expect(users).toEqual(dummyUsers);
    });

    const req = httpMock.expectOne(`${apiUrl}/group/1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyUsers);
  });

  it('should getGroups', () => {
    const dummyUsers = [{ first: '1' }, { second: '2' }];

    service.getGroups().then(users => {
      expect(users.length).toBe(2);
      expect(users).toEqual(dummyUsers);
    });

    const req = httpMock.expectOne(`${apiUrl}/groups`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyUsers);
  });

  it('should updateStudents', () => {
    const dummyUsers = [{ first: '1' }, { second: '2' }];

    service.updateStudents([]).then(users => {
      expect(users.length).toBe(2);
      expect(users).toEqual(dummyUsers);
    });

    const req = httpMock.expectOne(`${apiUrl}/update`);
    expect(req.request.method).toBe('PUT');
    req.flush(dummyUsers);
  });

  it('should addStudents', () => {
    const dummyUsers = [{ first: '1' }, { second: '2' }];

    service.addStudents([]).then(users => {
      expect(users.length).toBe(2);
      expect(users).toEqual(dummyUsers);
    });

    const req = httpMock.expectOne(`${apiUrl}/add`);
    expect(req.request.method).toBe('POST');
    req.flush(dummyUsers);
  });

  it('should deleteStudents', () => {
    const dummyUsers = [{ first: '1' }, { second: '2' }];

    service.deleteStudents(new Set([1, 2])).then(users => {
      expect(users.length).toBe(2);
      expect(users).toEqual(dummyUsers);
    });

    const req = httpMock.expectOne(`${apiUrl}/delete?id=1&id=2`);
    expect(req.request.method).toBe('DELETE');
    req.flush(dummyUsers);
  });
});
