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

  let backendData: WeatherForecastBackendData = {
    "cod": "200",
    "message": 0,
    "cnt": 40,
    "list": [
        {
            "dt": 1666008000,
            "main": {
                "temp": 20.83,
                "feels_like": 20.93,
                "temp_min": 20.83,
                "temp_max": 21.28,
                "pressure": 1025,
                "sea_level": 1025,
                "grnd_level": 1019,
                "humidity": 75,
                "temp_kf": -0.45
            },
            "weather": [
                {
                    "id": 804,
                    "main": "Clouds",
                    "description": "zachmurzenie duże",
                    "icon": "04d"
                }
            ],
            "clouds": {
                "all": 89
            },
            "wind": {
                "speed": 4.43,
                "deg": 192,
                "gust": 7.25
            },
            "visibility": 10000,
            "pop": 0,
            "sys": {
                "pod": "d"
            },
            "dt_txt": "2022-10-17 12:00:00"
        },
        {
            "dt": 1666018800,
            "main": {
                "temp": 20.7,
                "feels_like": 20.63,
                "temp_min": 20.44,
                "temp_max": 20.7,
                "pressure": 1024,
                "sea_level": 1024,
                "grnd_level": 1018,
                "humidity": 69,
                "temp_kf": 0.26
            },
            "weather": [
                {
                    "id": 804,
                    "main": "Clouds",
                    "description": "zachmurzenie duże",
                    "icon": "04d"
                }
            ],
            "clouds": {
                "all": 89
            },
            "wind": {
                "speed": 3.64,
                "deg": 195,
                "gust": 8.67
            },
            "visibility": 10000,
            "pop": 0,
            "sys": {
                "pod": "d"
            },
            "dt_txt": "2022-10-17 15:00:00"
        }
      ],
      "city": {
          "id": 3083271,
          "name": "Toruń",
          "coord": {
              "lat": 53.0103,
              "lon": 18.6048
          },
          "country": "PL",
          "population": 208717,
          "timezone": 7200,
          "sunrise": 1665983689,
          "sunset": 1666021608
      }
  };

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

    req.flush(backendData);
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
