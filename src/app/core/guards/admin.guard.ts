import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate, CanLoad {
  constructor(private router: Router) {}

  public canActivate(): boolean {
    return this.isUserAdmin();
  }

  public canLoad(): boolean {
    return this.isUserAdmin();
  }

  private isUserAdmin(): boolean {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user && user.isAdmin) {
      return true;
    }
    return false;
  }
}
