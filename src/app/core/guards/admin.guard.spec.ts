import { AdminGuard } from './admin.guard';

class MockRouter {
  navigate(path) {}
}

class MockAuthenticationService {
  login(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  logout(): void {
    localStorage.removeItem('currentUser');
  }
}

describe('AdminGuard canActivate', () => {
  let adminGuard: AdminGuard;
  let router;
  let authenticationService;

  it('should return true for a logged in user', () => {
    router = new MockRouter();
    adminGuard = new AdminGuard(router);
    authenticationService = new MockAuthenticationService();
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

describe('AdminGuard canLoad', () => {
  let adminGuard: AdminGuard;
  let router;
  let authenticationService;

  it('should return true for a logged in user', () => {
    router = new MockRouter();
    adminGuard = new AdminGuard(router);
    authenticationService = new MockAuthenticationService();
    authenticationService.logout();

    authenticationService.login({ token: 'mocUser', isAdmin: false });
    expect(adminGuard.canLoad()).toEqual(false);

    authenticationService.logout();
    expect(adminGuard.canLoad()).toEqual(false);

    authenticationService.login({ token: 'mocUser', isAdmin: true });
    expect(adminGuard.canLoad()).toEqual(true);
  });
});
