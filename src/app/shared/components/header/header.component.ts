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
  languageList: ILanguage[] = [
    { code: 'en', label: 'English' },
    { code: 'ru', label: 'Russian' },
  ];

  public siteLanguage: ILanguage;

  public ngOnInit(): void {
    const storedCode = localStorage.getItem('lang');
    this.siteLanguage = storedCode
      ? this.languageList.find((lang: ILanguage) => lang.code === storedCode)
      : this.languageList[0];
    this.service.setActiveLang(this.siteLanguage.code);
  }

  constructor(private service: TranslocoService) {}

  public changeSiteLanguage(language: ILanguage): void {
    this.service.setActiveLang(language.code);
    localStorage.setItem('lang', language.code);
    this.siteLanguage = language;
  }

  public compareThem(o1: ILanguage, o2: ILanguage): boolean {
    return o1.code === o2.code;
  }

  public isTeachersShouldBeShown(): boolean {
    const user: IUser = JSON.parse(localStorage.getItem('currentUser'));
    return user && user.isAdmin;
  }
}
