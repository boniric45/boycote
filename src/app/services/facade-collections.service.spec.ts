import { TestBed } from '@angular/core/testing';

import { FacadeCollectionsService } from './facade-collections.service';

describe('FacadeCollectionsService', () => {
  let service: FacadeCollectionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FacadeCollectionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
