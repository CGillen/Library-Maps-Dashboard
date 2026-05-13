import { TestBed } from '@angular/core/testing';

import { LibRangeService } from './lib-range.service';

describe('LibRangeService', () => {
  let service: LibRangeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LibRangeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
