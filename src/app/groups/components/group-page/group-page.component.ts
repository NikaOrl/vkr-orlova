import { Component } from '@angular/core';

@Component({
  selector: 'app-group-page',
  templateUrl: './group-page.component.html',
  styleUrls: ['./group-page.component.scss'],
})
export class GroupPageComponent {
  isTeachersShouldBeShown() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user && user.isAdmin) {
      return true;
    }
    return false;
  }
}
