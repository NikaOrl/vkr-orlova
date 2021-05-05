import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockComponent } from 'ng-mocks';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { LoginPageComponent } from './login-page.component';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { ActivatedRouteStub, RouterStub } from '../../../shared/utils/tests-stubs';
import { getTranslocoModule } from '../../../transloco/transloco-testing.module';
import { AuthenticationServiceStub } from '../../services/authentication/authentication.service.spec';
import { HeaderComponent } from '../../../shared/components/header/header.component';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  let authenticationService: AuthenticationService;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [LoginPageComponent, MockComponent(HeaderComponent)],
      imports: [
        FormsModule,
        MatButtonModule,
        MatCardModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatIconModule,
        NoopAnimationsModule,
        getTranslocoModule(),
      ],
      providers: [
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        { provide: Router, useClass: RouterStub },
        { provide: AuthenticationService, useClass: AuthenticationServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    authenticationService = TestBed.inject(AuthenticationService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should login', () => {
    const loginSpy: jasmine.Spy = spyOn(authenticationService, 'login').and.callThrough();
    component.login();
    expect(loginSpy).toHaveBeenCalled();
  });
});
