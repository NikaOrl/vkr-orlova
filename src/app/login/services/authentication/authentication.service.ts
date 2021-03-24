import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { IUser } from '../../../core/interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private http: HttpClient) {}

  public login(email: string, password: string): Observable<IUser> {
    return this.http
      .post<IUser>(`/api/login`, {
        email,
        password,
      })
      .pipe(
        map(user => {
          // login successful if there's a jwt token in the response
          if (user && user.token) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user));
          }
          return user;
        })
      );
  }

  public logout(): void {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
  }
}
