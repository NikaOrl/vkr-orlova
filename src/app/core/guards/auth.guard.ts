import { Injectable } from '@angular/core';
import { CanActivate, Router, CanLoad } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private router: Router) {}

  public canActivate(): boolean {
    return this.checkLogin();
  }

  public canLoad(): boolean {
    return this.checkLogin();
  }

  private checkLogin(): boolean {
    if (localStorage.getItem('currentUser')) {
      // logged in so return true
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
