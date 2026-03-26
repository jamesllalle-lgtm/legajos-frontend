import { TestBed } from '@angular/core/testing';

import { ExportarexcelService } from './exportarexcel.service';

describe('ExportarexcelService', () => {
  let service: ExportarexcelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExportarexcelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
