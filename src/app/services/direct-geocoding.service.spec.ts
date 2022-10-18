import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DirectGeocodingService } from './direct-geocoding.service';
import { DirectGeocodingInterface } from '../models/direct-geocoding-interface';
import { ErrorDetailsInterface } from '../models/error-details-interface';

describe('DirectGeocodingService', () => {
  let directGeocodingService: DirectGeocodingService;
  let injector: TestBed;
  let httpMock: HttpTestingController;

  let backendData = [{
    name: "Toruń",
    local_names: {
        eo: "Toruno",
        sk: "Toruň",
        uk: "Торунь",
        lt: "Torunė",
        ja: "トルン",
        pl: "Toruń",
        he: "טורון",
        la: "Thorunium",
        be: "Торунь",
        ru: "Торунь",
        mk: "Торуњ",
        de: "Thorn"
    },
    lat: 53.0102721,
    lon: 18.6048094,
    country: "PL",
    state: "Kuyavian-Pomeranian Voivodeship"}];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ DirectGeocodingService ],
      imports: [ HttpClientTestingModule ]
    });

    injector = getTestBed();
    directGeocodingService = injector.inject(DirectGeocodingService);
    httpMock = injector.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(directGeocodingService).toBeTruthy();
  });

  it('should return an Observable<DirectGeocodingInterface>', () => {
    directGeocodingService.generateDataForDirectGeocoding('112233', 'kujawsko pomorskie', 'Toruń').subscribe(
      response => {
        expect(response?.name).toBe('Toruń');
        expect(response?.state).toBe('Kuyavian-Pomeranian Voivodeship');
        expect(response?.country).toBe('PL');
        expect(response?.latitude).toBe(53.0102721);
        expect(response?.longtitude).toBe(18.6048094);
      }
    );

    const req = httpMock.expectOne(directGeocodingService.getDirectGeocodingUrl('112233', 'kujawsko pomorskie', 'Toruń'));
    expect(req.request.method).toBe('GET');
    req.flush(backendData);
  });

  it("should return undefined when server returns 404", () => {
    let succeeded = false;
    let body: DirectGeocodingInterface  | undefined;
  
    directGeocodingService.generateDataForDirectGeocoding('112233', 'kujawsko pomorskie', 'Toruń').subscribe(response => {
      succeeded = true;
      body = response;
    });
  
    const testRequest = httpMock.expectOne(directGeocodingService.getDirectGeocodingUrl('112233', 'kujawsko pomorskie', 'Toruń'));
    testRequest.flush("", { status: 404, statusText: "Not Found" });
  
    expect(succeeded).toBeTrue();
    expect(body).toBeUndefined();
  });

  it("should throw error with response body when server returns error other than 404", () => {
    let body: ErrorDetailsInterface | undefined;
  
    directGeocodingService.generateDataForDirectGeocoding('112233', 'kujawsko pomorskie', 'Toruń').subscribe(
      () => {},
      (error: ErrorDetailsInterface) => {
        body = error;
      }
    );
  
    const expected: ErrorDetailsInterface = {
      code: "validationFailed",
      message: "Invalid input",
    };
  
    const testRequest = httpMock.expectOne(directGeocodingService.getDirectGeocodingUrl('112233', 'kujawsko pomorskie', 'Toruń'));
    testRequest.flush(expected, { status: 400, statusText: "Bad Request" });
  
    expect(body).toEqual(expected);
  });

});
