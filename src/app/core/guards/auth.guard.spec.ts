import { AuthGuard } from './auth.guard';

class MockRouter {
  public navigate(path) {}
}

class MockAuthenticationService {
  public login() {
    localStorage.setItem('currentUser', JSON.stringify('mocUser'));
  }

  public logout(): void {
    localStorage.removeItem('currentUser');
  }
}

describe('AuthGuard canActivate', () => {
  let authGuard: AuthGuard;
  let router;
  let authenticationService;

  beforeEach(() => {
    localStorage.clear();
  });

  it('should return true for a logged in user', () => {
    router = new MockRouter();
    authGuard = new AuthGuard(router);
    authenticationService = new MockAuthenticationService();
    authenticationService.logout();
    expect(authGuard.canActivate()).toEqual(false);

    authenticationService.login();
    expect(authGuard.canActivate()).toEqual(true);

    authenticationService.logout();
    expect(authGuard.canActivate()).toEqual(false);
  });
});

describe('AuthGuard canLoad', () => {
  let authGuard: AuthGuard;
  let router;
  let authenticationService;

  beforeEach(() => {
    localStorage.clear();
  });

  it('should return true for a logged in user', () => {
    router = new MockRouter();
    authGuard = new AuthGuard(router);
    authenticationService = new MockAuthenticationService();
    expect(authGuard.canLoad()).toEqual(false);

    authenticationService.login();
    expect(authGuard.canLoad()).toEqual(true);

    authenticationService.logout();
    expect(authGuard.canLoad()).toEqual(false);
  });
});
