import { TestBed } from '@angular/core/testing';

import { DirectGeocodingService } from './direct-geocoding.service';

describe('DirectGeocodingService', () => {
  let service: DirectGeocodingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DirectGeocodingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
