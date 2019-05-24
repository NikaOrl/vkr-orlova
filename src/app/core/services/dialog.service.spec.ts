import { DialogService } from './dialog.service';

describe('DialogService', () => {
  it('should be created', () => {
    const service: DialogService = new DialogService();
    expect(service).toBeTruthy();
  });

  it('should return false when clicked "cancel"', () => {
    const service: DialogService = new DialogService();
    spyOn(window, 'confirm').and.returnValue(false);
    service.confirm('test message').then(res => {
      expect(res).toBe(false);
    });
  });

  it('should return true when clicked "ok"', () => {
    const service: DialogService = new DialogService();
    spyOn(window, 'confirm').and.returnValue(true);
    service.confirm().then(res => {
      expect(res).toBe(true);
    });
  });
});
