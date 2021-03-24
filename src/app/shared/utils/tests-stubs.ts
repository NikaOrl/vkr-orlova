import { Directive, Input } from '@angular/core';
import { convertToParamMap } from '@angular/router';

import { of } from 'rxjs';

export class RouterStub {
  public navigate(path: string): null {
    return null;
  }
}

export class ActivatedRouteStub {
  // tslint:disable-next-line: no-any
  public get snapshot(): any {
    return {
      paramMap: {
        get: id => of(convertToParamMap({ id: 1 })),
      },
      queryParams: {
        returnUrl: '/',
      },
    };
  }
}

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[routerLink]',
})
export class RouterLinkStubDirective {
  @Input('routerLink') public linkParams: string;
}
