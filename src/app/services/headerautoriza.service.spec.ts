import { TestBed } from '@angular/core/testing';

import { HeaderautorizaService } from './headerautoriza.service';

describe('HeaderautorizaService', () => {
  let service: HeaderautorizaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeaderautorizaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
