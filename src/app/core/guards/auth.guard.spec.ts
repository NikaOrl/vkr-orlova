import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { MockAuthenticationService } from '../../login/services/authentication/authentication.service.spec';
import { RouterStub } from '../../shared/utils/tests-stubs';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let authenticationService: MockAuthenticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: Router, useClass: RouterStub }],
    });
    localStorage.clear();
    authGuard = TestBed.inject(AuthGuard);
    authenticationService = new MockAuthenticationService();
  });

  describe('canActivate', () => {
    it('should return true for a logged in user', () => {
      authenticationService.logout();
      expect(authGuard.canActivate()).toEqual(false);

      authenticationService.login({ token: 'mocUser', isAdmin: true });
      expect(authGuard.canActivate()).toEqual(true);

      authenticationService.logout();
      expect(authGuard.canActivate()).toEqual(false);
    });
  });

  describe('canLoad', () => {
    it('should return true for a logged in user', () => {
      expect(authGuard.canLoad()).toEqual(false);

      authenticationService.login({ token: 'mocUser', isAdmin: true });
      expect(authGuard.canLoad()).toEqual(true);

      authenticationService.logout();
      expect(authGuard.canLoad()).toEqual(false);
    });
  });
});
