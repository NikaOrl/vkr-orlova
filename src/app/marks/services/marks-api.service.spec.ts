import { TestBed } from '@angular/core/testing';

import { MarksApiService } from './marks-api.service';

describe('MarksApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MarksApiService = TestBed.get(MarksApiService);
    expect(service).toBeTruthy();
  });
});
