import { TestBed, getTestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { MarksApiService } from './marks-api.service';
import { Jobs } from '../models/jobs.model';
import { Marks } from '../models/marks.model';

const apiUrl = '/api/marks';

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
    service = injector.get(MarksApiService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should getStudents', () => {
    const dummyUsers = [{ login: 'John' }, { login: 'Doe' }];

    service.getMarks(1).then(users => {
      expect(users.length).toBe(2);
      expect(users).toEqual(dummyUsers);
    });

    const req = httpMock.expectOne(`${apiUrl}/discipline/1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyUsers);
  });

  it('should getGroups', () => {
    const dummyUsers = [{ first: '1' }, { second: '2' }];

    service.getDisciplines().then(users => {
      expect(users.length).toBe(2);
      expect(users).toEqual(dummyUsers);
    });

    const req = httpMock.expectOne(`${apiUrl}/disciplines`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyUsers);
  });

  it('should updateMarks', () => {
    const dummyUsers = [{ first: '1' }, { second: '2' }];

    service.updateMarks([]).then(users => {
      expect(users.length).toBe(2);
      expect(users).toEqual(dummyUsers);
    });

    const req = httpMock.expectOne(`${apiUrl}/update`);
    expect(req.request.method).toBe('PUT');
    req.flush(dummyUsers);
  });

  it('should updateJobs', () => {
    const dummyUsers = [{ first: '1' }, { second: '2' }];

    service.updateJobs([]).then(users => {
      expect(users.length).toBe(2);
      expect(users).toEqual(dummyUsers);
    });

    const req = httpMock.expectOne(`/api/jobs/update`);
    expect(req.request.method).toBe('PUT');
    req.flush(dummyUsers);
  });

  it('should addJobsAndMarks', () => {
    const dummyUsers = [{ first: '1' }, { second: '2' }];

    service.addJobsAndMarks(
      <Jobs[]>(<unknown>[{ id: 1, first: '1' }]),
      <Marks[]>(<unknown>[{ jobId: 1, first: '1' }, { jobId: 1, second: '2' }]),
    );
    const req2 = httpMock.expectOne(`/api/jobs/add`);
    expect(req2.request.method).toBe('POST');
    req2.flush(dummyUsers);
  });

  it('should deleteStudents', () => {
    const dummyUsers = [{ first: '1' }, { second: '2' }];

    service.deleteJobs(new Set([1, 2])).then(users => {
      expect(users.length).toBe(2);
      expect(users).toEqual(dummyUsers);
    });

    const req = httpMock.expectOne(`/api/jobs/delete?id=1&id=2`);
    const req2 = httpMock.expectOne(`/api/marks/delete?id=1&id=2`);
    expect(req.request.method).toBe('DELETE');
    expect(req2.request.method).toBe('DELETE');
    req.flush(dummyUsers);
  });
});
