import { TestBed } from '@angular/core/testing';

import { FloorLeafletDataServiceService } from './floor-leaflet-data-service.service';

describe('FloorLeafletDataServiceService', () => {
  let service: FloorLeafletDataServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FloorLeafletDataServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
