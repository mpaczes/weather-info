import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';
import { ErrorDetailsInterface } from '../models/error-details-interface';
import { WeatherForecastBackendData } from '../models/weather-forecast-backend-data';
import { WeatherForecastInterface } from '../models/weather-forecast-interface';

import { WeatherForecastService } from './weather-forecast.service';

describe('WeatherForecastService', () => {
  let weatherForecastService: WeatherForecastService;
  let injector: TestBed;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ WeatherForecastService ]
    });

    injector = getTestBed();

    weatherForecastService = injector.inject(WeatherForecastService);
    httpMock = injector.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(weatherForecastService).toBeTruthy();
  });

  it('should return on Observable<WeatherForecastInterface>', () => {
    weatherForecastService.getWeatherForecastData('112233', 53.0102721, 18.6048094).subscribe(weatherForecast => {
      if (weatherForecast) {
        expect(weatherForecast.cityName).toEqual('Toruń');
        expect(weatherForecast.cityCountry).toEqual('PL');
        expect(weatherForecast.weatherForecasts.length).toEqual(2);
      }
    });

    const req = httpMock.expectOne(weatherForecastService.getWeatherForecastUrl('112233', 53.0102721, 18.6048094));
    expect(req.request.method).toBe('GET');

    req.flush(weatherForecastService.getStaticData());
  });

  it('should return undefined when server returns 404', () => {
    let succeeded = false;
    let body: WeatherForecastInterface  | undefined;

    weatherForecastService.getWeatherForecastData('112233', 53.0102721, 18.6048094).subscribe(response => {
      succeeded = true;
      body = response;
    });

    const testRequest = httpMock.expectOne(weatherForecastService.getWeatherForecastUrl('112233', 53.0102721, 18.6048094));
    testRequest.flush({}, {  status: 404, statusText: 'Not Found' });

    expect(succeeded).toBeTrue();
    expect(body).toBeUndefined();
  });

  it('should throw error with response body when server returns error other than 404', () => {
    let body: ErrorDetailsInterface | undefined;

    weatherForecastService.getWeatherForecastData('112233', 53.0102721, 18.6048094).subscribe(
      () => {},
      (error: ErrorDetailsInterface) => {
        body = error;
      },
    );

    const expected: ErrorDetailsInterface = {
      code: 'validationFailed',
      message: 'Invalid input'
    };

    const testRequest = httpMock.expectOne(weatherForecastService.getWeatherForecastUrl('112233', 53.0102721, 18.6048094));
    testRequest.flush(expected, { status: 400, statusText: 'Bad Request' });

    expect(body).toEqual(expected);
  });

});
