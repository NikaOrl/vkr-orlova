import { Component } from '@angular/core';

import { IUser } from '../../../core/interfaces/user.interface';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  public isTeachersShouldBeShown(): boolean {
    const user: IUser = JSON.parse(localStorage.getItem('currentUser'));
    return user && user.isAdmin;
  }
}
