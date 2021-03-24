import { Component } from '@angular/core';

import { Observable } from 'rxjs';

import { CanDeactivateGuard } from './can-deactivate.guard';
import { CanComponentDeactivate } from '../interfaces/can-component-deactivate.interface';

@Component({})
export class MockComponent implements CanComponentDeactivate {
  public returnValue: boolean | Observable<boolean>;

  public canDeactivate(): boolean | Observable<boolean> {
    return this.returnValue;
  }
}

describe('CanDeactivateGuard CanDeactivate', () => {
  let canDeactivateGuard: CanDeactivateGuard;
  let mockComponent: MockComponent;

  it('should work correctly with canDeactivate', () => {
    mockComponent = new MockComponent();
    canDeactivateGuard = new CanDeactivateGuard();
    mockComponent.returnValue = true;
    expect(canDeactivateGuard.canDeactivate(mockComponent)).toEqual(true);

    mockComponent.returnValue = false;
    expect(canDeactivateGuard.canDeactivate(mockComponent)).toEqual(false);
  });
});
