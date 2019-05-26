import { Component } from '@angular/core';

@Component({
  selector: 'app-marks-page',
  templateUrl: './marks-page.component.html',
  styleUrls: ['./marks-page.component.scss'],
})
export class MarksPageComponent {
  isTeachersShouldBeShown() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user && user.isAdmin) {
      return true;
    }
    return false;
  }
}
