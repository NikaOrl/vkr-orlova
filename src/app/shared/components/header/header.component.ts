import { Component, OnInit } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';

import { IUser } from '../../../core/interfaces/user.interface';

interface ILanguage {
  code: string;
  label: string;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public languageList: ILanguage[] = [
    { code: 'en', label: 'English' },
    { code: 'ru', label: 'Russian' },
  ];

  public siteLanguage: ILanguage;

  constructor(private translocoService: TranslocoService) {}

  public ngOnInit(): void {
    const storedCode: string = localStorage.getItem('lang');
    this.siteLanguage = storedCode
      ? this.languageList.find((lang: ILanguage) => lang.code === storedCode)
      : this.languageList[0];
    this.translocoService.setActiveLang(this.siteLanguage.code);
  }

  public changeSiteLanguage(language: ILanguage): void {
    this.translocoService.setActiveLang(language.code);
    localStorage.setItem('lang', language.code);
    this.siteLanguage = language;
  }

  public compareThem(o1: ILanguage, o2: ILanguage): boolean {
    return o1 && o2 && o1.code === o2.code;
  }

  public isTeachersShouldBeShown(): boolean {
    const user: string = localStorage.getItem('currentUser');
    return user ? JSON.parse(user).isAdmin : false;
  }
}
