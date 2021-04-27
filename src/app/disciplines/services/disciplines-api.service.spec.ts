import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Observable, of } from 'rxjs';

import { IDiscipline } from 'src/app/disciplines/models/discipline.model';
import { DisciplinesApiService } from './disciplines-api.service';
import { ITeacher } from 'src/app/teachers/models/teacher.model';
import { IDisciplineGroup } from '../models/group-students.model';

export const mockGroupStudents: IDisciplineGroup[] = [
  {
    id: 1,
    groupNumber: 5381,
    students: [
      {
        id: 1,
        firstName: 'Ivan',
        lastName: 'Ivanov',
        groupId: 1,
        isInDiscipline: false,
      },
    ],
  },
];

export class DisciplinesApiServiceStub {
  public getDisciplines(): Observable<IDiscipline[]> {
    return of([{ id: 1 } as IDiscipline, { id: 2 } as IDiscipline]);
  }

  public getTeachers(): Observable<ITeacher[]> {
    return of([]);
  }

  public getGroupsAndStudents(disciplineId: number): Observable<IDisciplineGroup[]> {
    return of(mockGroupStudents);
  }

  public updateGroupsAndStudents(
    disciplineId: number,
    groupsAndStudentsData: IDisciplineGroup[]
  ): Observable<{ status: string }> {
    return of({ status: 'ok' });
  }

  public updateDiscipline(discipline: IDiscipline): Observable<{ status: string }> {
    return of({ status: 'ok' });
  }
}

describe('DisciplinesApiService', () => {
  let injector: TestBed;
  let service: DisciplinesApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DisciplinesApiService],
    });
    injector = getTestBed();
    service = TestBed.inject(DisciplinesApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
