import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';

import { Observable } from 'rxjs';

import { CoreModule } from '../core.module';
import { CanComponentDeactivate } from './../interfaces/can-component-deactivate.interface';

@Injectable({
  providedIn: CoreModule,
})
export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {
  public canDeactivate(component: CanComponentDeactivate): Observable<boolean> | Promise<boolean> | boolean {
    console.log('CanDeactivate Guard is called');
    return component.canDeactivate();
  }
}
