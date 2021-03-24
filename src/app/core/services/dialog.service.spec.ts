import { TestBed } from '@angular/core/testing';

import { DialogService } from './dialog.service';

export class DialogServiceStub {}

describe('DialogService', () => {
  let service: DialogService;

  beforeEach(() => {
    service = TestBed.inject(DialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return false when clicked "cancel"', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    service.confirm('test message').then(res => {
      expect(res).toBe(false);
    });
  });

  it('should return true when clicked "ok"', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    service.confirm().then(res => {
      expect(res).toBe(true);
    });
  });
});
