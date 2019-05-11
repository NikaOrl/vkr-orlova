import { Injectable } from '@angular/core';
import { CanActivate, Router, CanLoad } from '@angular/router';
import { CoreModule } from '../core.module';

@Injectable({
  providedIn: CoreModule,
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private router: Router) {}

  canActivate() {
    return this.checkLogin();
  }

  canLoad(): boolean {
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
