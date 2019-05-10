import { TestBed } from '@angular/core/testing';

import { GroupsApiService } from './api.service';

describe('GroupsApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GroupsApiService = TestBed.get(GroupsApiService);
    expect(service).toBeTruthy();
  });
});
