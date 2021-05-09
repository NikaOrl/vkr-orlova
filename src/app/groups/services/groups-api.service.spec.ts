import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';

import { GroupsApiService } from './groups-api.service';
import { IStudent } from '../models/student.model';
import { IGroup } from '../models/group.model';
import { GROUPS } from '../../core/http-constants';
import { Observable, of } from 'rxjs';

export class GroupsApiServiceStub {
  public getGroup(groupId: number): Observable<IGroup> {
    return of({ groupNumber: '', id: '1', students: [{ id: '1' } as IStudent, { id: '2' } as IStudent] });
  }

  public getGroups(): Observable<unknown> {
    return of([
      { id: '1', groupNumber: '1' },
      { id: '2', groupNumber: '2' },
    ]);
  }

  public updateGroup(students: IStudent[]): Observable<unknown> {
    return of('groups');
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

  it('should getGroup', () => {
    const dummyGroup: IGroup = {
      groupNumber: '',
      students: [{ lastName: 'John' } as IStudent, { lastName: 'Doe' } as IStudent],
    };

    service.getGroup('1').subscribe(users => {
      expect(users.students.length).toBe(2);
      expect(users).toEqual(dummyGroup);
    });

    const req: TestRequest = httpMock.expectOne(`${GROUPS}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyGroup);
  });

  it('should getGroups', () => {
    const dummyUsers: IGroup[] = [{ id: '1' } as IGroup, { id: '2' } as IGroup];

    service.getGroups().subscribe(users => {
      expect(users.length).toBe(2);
      expect(users).toEqual(dummyUsers);
    });

    const req: TestRequest = httpMock.expectOne(`${GROUPS}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyUsers);
  });

  it('should updateGroup', () => {
    const status: { status: string } = { status: 'success' };

    service.updateGroup({ groupNumber: '', id: '1', students: [] }).subscribe(users => {
      expect(users).toEqual(status);
    });

    const req: TestRequest = httpMock.expectOne(`${GROUPS}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(status);
  });
});
