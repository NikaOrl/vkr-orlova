import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    // return this.http
    //   .post<any>(`/users/authenticate`, {
    //     username: username,
    //     password: password,
    //   })
    //   .pipe(
    //     map(user => {
    //       // login successful if there's a jwt token in the response
    //       if (user && user.token) {
    //         // store user details and jwt token in local storage to keep user logged in between page refreshes
    //         localStorage.setItem('currentUser', JSON.stringify(user));
    //       }

    //       return user;
    //     }),
    //   );

    // temporary while there is no backend:
    if (username === 'admin' && password === 'admin') {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      localStorage.setItem(
        'currentUser',
        JSON.stringify({ username: username }),
      );
    }
    return of(null);
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
  }
}
