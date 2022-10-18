import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { CurrentWeatherInterface } from '../models/current-weather-interface';
import { CurrentWeatherBackendData } from '../models/current-weather-backend-data';

/**
 * This service handles current weather with URL https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}
	
	Here is an example of valid URL https://api.openweathermap.org/data/2.5/weather?lat=53.015331&lon=18.605700&appid=799b0868d04c2accde4c7e8836ced7ae&units=metric&lang=pl

 */
@Injectable({
  providedIn: 'root'
})
export class CurrentWeatherService {

	currentWeatherUrl = 'https://api.openweathermap.org/data/2.5/weather?lat=<LAT>&lon=<LON>&appid=<API_KEY>&units=metric&lang=PL';

	constructor(private http: HttpClient) { }

	getCurrentWeatherUrl(apiKey: string, lat: number, lon: number) {
		let url: string = this.currentWeatherUrl;
		return url.replace('<LAT>', lat + '').replace('<LON>', lon + '').replace('<API_KEY>', apiKey);
	}

	generateDataForCurrentWeather(apiKey: string, lat: number, lon: number): Observable<CurrentWeatherInterface | undefined> {
		let url: string = this.currentWeatherUrl;
		url = url.replace('<LAT>', lat + '').replace('<LON>', lon + '').replace('<API_KEY>', apiKey);
		
		return this.http.get(url)
			.pipe(
				map(backendData => {
					let dataFromBackend: CurrentWeatherBackendData = (<CurrentWeatherBackendData> backendData);
	
					let currentWeatgerData: CurrentWeatherInterface  = {
						weatherMain: dataFromBackend.weather[0].main,
						weatherDescription: dataFromBackend.weather[0].description,
						weatherIcon: dataFromBackend.weather[0].icon,
						mainTemp: dataFromBackend.main.temp,
						mainTempMin: dataFromBackend.main.temp_min,
						mainTempMax: dataFromBackend.main.temp_max,
						mainFeelsLike: dataFromBackend.main.feels_like,
						mainPressure: dataFromBackend.main.pressure,
						mainHumidity: dataFromBackend.main.humidity,
						windSpeed: dataFromBackend.wind.speed,
						windDeg: dataFromBackend.wind.deg,
						windGust: dataFromBackend.wind.gust,
						dt: dataFromBackend.dt
					};
	
				return currentWeatgerData;
			}),
			catchError((error: HttpErrorResponse) => {
				if (error.status === 404) {
					return of(undefined);
				} else {
					return throwError(error.error);
				}
			}));
	}

	getStaticData(): CurrentWeatherInterface {
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
	}
	
	let currentWeatgerData: CurrentWeatherInterface  = {
		weatherMain: backendData.weather[0].main,
		weatherDescription: backendData.weather[0].description,
		weatherIcon: backendData.weather[0].icon,
		mainTemp: backendData.main.temp,
		mainFeelsLike: backendData.main.feels_like,
		mainHumidity: backendData.main.humidity,
		mainPressure: backendData.main.pressure,
		mainTempMin: backendData.main.temp_min,
		mainTempMax: backendData.main.temp_max,
		windSpeed: backendData.wind.speed,
		windDeg: backendData.wind.deg,
		windGust: backendData.wind.gust,
		dt: backendData.dt
		};
	
	return currentWeatgerData;
	}
}
