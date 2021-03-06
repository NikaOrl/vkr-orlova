import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { first } from 'rxjs/operators';

import { AuthenticationService } from '../../services/authentication/authentication.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit {
  public email: string;
  public password: string;
  public returnUrl: string;
  public showSpinner: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  public ngOnInit(): void {
    this.authenticationService.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
  }

  public login(): void {
    this.authenticationService
      .login(this.email, this.password)
      .pipe(first())
      // tslint:disable-next-line: deprecation
      .subscribe(
        data => {
          this.router.navigate([this.returnUrl]);
        },
        error => {
          // should show error message
          alert(error.error);
        }
      );
  }
}
