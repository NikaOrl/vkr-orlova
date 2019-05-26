import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Injectable } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { convertToParamMap, ActivatedRoute, Router } from '@angular/router';

import { BehaviorSubject, of } from 'rxjs';

import { LoginPageComponent } from './login-page.component';
import { AuthenticationService } from '../../services/authentication/authentication.service';

// tslint:disable-next-line:component-selector
@Component({ selector: 'mat-card', template: '' })
class MatCartStubComponent {}

// tslint:disable-next-line:component-selector
@Component({ selector: 'mat-card-header', template: '' })
class MatCartHeaderStubComponent {}

// tslint:disable-next-line:component-selector
@Component({ selector: 'mat-card-title', template: '' })
class MatCartTitleStubComponent {}

// tslint:disable-next-line:component-selector
@Component({ selector: 'mat-card-content', template: '' })
class MatCartContentStubComponent {}

// tslint:disable-next-line:component-selector
@Component({ selector: 'mat-form-field', template: '' })
class MatCartFormFieldStubComponent {}

// tslint:disable-next-line:component-selector
@Component({ selector: 'mat-spinner', template: '' })
class MatSpinnerStubComponent {}

// tslint:disable-next-line:component-selector
@Component({ selector: 'mat-card-actions', template: '' })
class MatCartActionsStubComponent {}

@Injectable()
export class ActivatedRouteStub {
  private subject = new BehaviorSubject(this.testParams);
  private _testParams: {};
  paramMap = this.subject.asObservable();

  snapshot = {
    paramMap: convertToParamMap({ id: 1 }),
    queryParams: {
      returnUrl: '/',
    },
  };

  get testParams() {
    return this._testParams;
  }
  set testParams(paramMap: {}) {
    this._testParams = paramMap;
    this.subject.next(paramMap);
  }
}

@Injectable()
export class RouterStub {
  navigate(path) {
    return {};
  }
}

@Injectable()
export class AuthenticationServiceStub {
  login() {
    localStorage.setItem('currentUser', JSON.stringify('mocUser'));
    return of('test');
  }

  logout(): void {
    localStorage.removeItem('currentUser');
  }
}

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LoginPageComponent,
        MatCartStubComponent,
        MatCartHeaderStubComponent,
        MatCartTitleStubComponent,
        MatCartContentStubComponent,
        MatCartFormFieldStubComponent,
        MatSpinnerStubComponent,
        MatCartActionsStubComponent,
      ],
      imports: [FormsModule],
      providers: [
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        { provide: Router, useClass: RouterStub },
        { provide: AuthenticationService, useClass: AuthenticationServiceStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should login', () => {
    component.login();
  });
});
