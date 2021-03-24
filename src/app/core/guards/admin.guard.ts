import { Injectable } from '@angular/core';
import { CanActivate, CanLoad } from '@angular/router';

import { IUser } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate, CanLoad {
  constructor() {}

  public canActivate(): boolean {
    return this.isUserAdmin();
  }

  public canLoad(): boolean {
    return this.isUserAdmin();
  }

  private isUserAdmin(): boolean {
    const user: IUser = JSON.parse(localStorage.getItem('currentUser'));
    if (user && user.isAdmin) {
      return true;
    }
    return false;
  }
}
