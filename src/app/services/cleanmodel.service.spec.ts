import { TestBed } from '@angular/core/testing';

import { CleanmodelService } from './cleanmodel.service';

describe('CleanmodelService', () => {
  let service: CleanmodelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CleanmodelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
