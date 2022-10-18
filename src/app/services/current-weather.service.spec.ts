// import { HttpClient } from '@angular/common/http';

import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { CurrentWeatherService } from './current-weather.service';
import { CurrentWeatherBackendData } from '../models/current-weather-backend-data';
import { CurrentWeatherInterface } from '../models/current-weather-interface';
import { ErrorDetailsInterface } from '../models/error-details-interface';

/*
* The HttpClientTestingModule makes it easier to mock requests using the HttpTestingController service.
*/

describe('CurrentWeatherService', () => {
  let currentWeatherService: CurrentWeatherService;
  let injector: TestBed;
  let httpMock: HttpTestingController;

  let backendData: CurrentWeatherBackendData = {
		coord: {
			lon: 18.6057,
			lat: 53.0153
		},
		weather: [
			{
				id: 801,
				main: "Clouds",
				description: "few clouds",
				icon: "02n"
			}
		],
		base: "stations",
		main: {
			temp: 9.95,
			feels_like: 8.48,
			temp_min: 9.49,
			temp_max: 12.59,
			pressure: 1003,
			humidity: 95
		},
		visibility: 10000,
		wind: {
			speed: 2.96,
			deg: 258,
			gust: 9.07
		},
		clouds: {
			all: 12
		},
		dt: 1663443562,
		sys: {
			type: 2,
			id: 2036314,
			country: "PL",
			sunrise: 1663388550,
			sunset: 1663433881
		},
		timezone: 7200,
		id: 3083271,
		name: "Toruń",
		cod: 200
	};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ CurrentWeatherService ]
    });

    injector = getTestBed();

    currentWeatherService = injector.inject(CurrentWeatherService);
    httpMock = injector.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(currentWeatherService).toBeTruthy();
  });

  /*
  * You can use the HttpTestingController to mock requests and the flush method to provide dummy values as responses.
  * As the HTTP request methods return an Observable, we subscribe to it and create our expectations in the callback methods.
  */

  it('should return an Observable<CurrentWeatherInterface>', () => {
    currentWeatherService.generateDataForCurrentWeather('112233', 53.0153, 18.6057).subscribe(currentWeatherParsed => {
		if (currentWeatherParsed) {
	      expect(currentWeatherParsed.weatherMain).toEqual('Clouds');
	      expect(currentWeatherParsed.weatherIcon).toEqual('02n');
	      expect(currentWeatherParsed.mainTemp).toEqual(9.95);
	      expect(currentWeatherParsed.windSpeed).toEqual(2.96);
		}
    });

    const req = httpMock.expectOne(currentWeatherService.getCurrentWeatherUrl('112233', 53.0153, 18.6057));
    expect(req.request.method).toBe('GET');

    req.flush(backendData);
  });

  /*
  * To simulate error responses from the server, you should use the flush method instead.
  * It allows you to specify the status code (and message) in addiiton to the response body.
  * The application  code that checks the HttpErrorResponse.status property will receive the specified status code.
  */
  it('should return undefined when server returns 404', () => {
	let succeeded = false;
	let body: CurrentWeatherInterface  | undefined;

	currentWeatherService.generateDataForCurrentWeather('112233', 53.0153, 18.6057).subscribe(response => {
		succeeded = true;
		body = response;
	});

	const testRequest = httpMock.expectOne(currentWeatherService.getCurrentWeatherUrl('112233', 53.0153, 18.6057));
	testRequest.flush({}, { status: 404, statusText: 'Not Found' });

	expect(succeeded).toBeTrue();
	expect(body).toBeUndefined();
  });

  it('should throw error with response body when server returns error other than 404', () => {
	let body: ErrorDetailsInterface | undefined;

	currentWeatherService.generateDataForCurrentWeather('112233', 53.0153, 18.6057).subscribe(
		() => {},
		(error: ErrorDetailsInterface) => {
			body = error;
		}
	);

	const expected: ErrorDetailsInterface = {
		code: 'validationFailed',
		message: 'Invalid input'
	}

	const testRequest = httpMock.expectOne(currentWeatherService.getCurrentWeatherUrl('112233', 53.0153, 18.6057));
	testRequest.flush(expected, { status: 400, statusText: 'Bad Request' });

	expect(body).toEqual(expected);
  });

});
