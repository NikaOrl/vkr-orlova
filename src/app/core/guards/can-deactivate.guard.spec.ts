import { CanDeactivateGuard } from './can-deactivate.guard';
import { Component } from '@angular/core';
import { CanComponentDeactivate } from '../interfaces/can-component-deactivate.interface';
import { Observable } from 'rxjs';

@Component({})
export class MockComponent implements CanComponentDeactivate {
  returnValue: boolean | Observable<boolean>;

  canDeactivate(): boolean | Observable<boolean> {
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
