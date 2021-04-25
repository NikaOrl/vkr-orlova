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

  it('should return false when clicked "cancel"', async () => {
    spyOn(window, 'confirm').and.returnValue(false);
    const res: boolean = await service.confirm('test message');
    expect(res).toBe(false);
  });

  it('should return true when clicked "ok"', async () => {
    spyOn(window, 'confirm').and.returnValue(true);
    const res: boolean = await service.confirm();
    expect(res).toBe(true);
  });
});
