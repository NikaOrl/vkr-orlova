import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { Observable, of } from 'rxjs';

import { AuthenticationService } from './authentication.service';
import { IUser } from '../../../core/interfaces/user.interface';

export class AuthenticationServiceStub {
  public login(user: IUser): Observable<string> {
    localStorage.setItem('currentUser', JSON.stringify(user));
    return of('test');
  }

  public logout(): void {
    localStorage.removeItem('currentUser');
  }
}

describe('AuthenticationService', () => {
  let injector: TestBed;
  let service: AuthenticationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthenticationService],
    });

    injector = getTestBed();
    service = TestBed.inject(AuthenticationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login', () => {
    const dummyUser: IUser = { token: 'mocUser', isAdmin: false } as IUser;

    // tslint:disable-next-line: deprecation
    service.login('user', 'password').subscribe(user => {
      expect(user).toEqual(dummyUser);
    });

    const req: TestRequest = httpMock.expectOne(`/api/login`);
    expect(req.request.method).toBe('POST');
    req.flush(dummyUser);
    service.logout();
  });
});
