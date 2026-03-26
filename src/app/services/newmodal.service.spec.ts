import { TestBed } from '@angular/core/testing';

import { NewmodalService } from './newmodal.service';

describe('NewmodalService', () => {
  let service: NewmodalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewmodalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
