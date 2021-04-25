import { TranslocoTestingModule, TranslocoTestingOptions } from '@ngneat/transloco';
import en from '../../assets/i18n/en.json';
import ru from '../../assets/i18n/ru.json';

// tslint:disable-next-line: no-any
export function getTranslocoModule(options: TranslocoTestingOptions = {}): any {
  return TranslocoTestingModule.forRoot({
    langs: { en, ru },
    translocoConfig: {
      availableLangs: ['en', 'es'],
      defaultLang: 'en',
    },
    preloadLangs: true,
    ...options,
  });
}
