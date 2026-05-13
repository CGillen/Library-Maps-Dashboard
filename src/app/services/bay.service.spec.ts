import { TestBed } from '@angular/core/testing';

import { BayService } from './bay.service';

describe('BayService', () => {
  let service: BayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
