import { TestBed } from '@angular/core/testing';

import { AuthenticationServiceStub } from '../../login/services/authentication/authentication.service.spec';
import { AdminGuard } from './admin.guard';

describe('AdminGuard', () => {
  let adminGuard: AdminGuard;
  let authenticationService: AuthenticationServiceStub;

  beforeEach(() => {
    adminGuard = TestBed.inject(AdminGuard);
    localStorage.clear();
  });

  describe('AdminGuard canActivate', () => {
    it('should return true for a logged in user', () => {
      authenticationService = new AuthenticationServiceStub();
      authenticationService.logout();
      expect(adminGuard.canActivate()).toEqual(false);

      authenticationService.login({ token: 'mocUser', isAdmin: false });
      expect(adminGuard.canActivate()).toEqual(false);

      authenticationService.logout();
      expect(adminGuard.canActivate()).toEqual(false);

      authenticationService.login({ token: 'mocUser', isAdmin: true });
      expect(adminGuard.canActivate()).toEqual(true);
    });
  });

  describe('canLoad', () => {
    it('should return true for a logged in user', () => {
      authenticationService = new AuthenticationServiceStub();
      authenticationService.logout();

      authenticationService.login({ token: 'mocUser', isAdmin: false });
      expect(adminGuard.canLoad()).toEqual(false);

      authenticationService.logout();
      expect(adminGuard.canLoad()).toEqual(false);

      authenticationService.login({ token: 'mocUser', isAdmin: true });
      expect(adminGuard.canLoad()).toEqual(true);
    });
  });
});
