import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { SingleWeatherForecastInterface, WeatherForecastInterface } from '../models/weather-forecast-interface';
import { WeatherForecastBackendData } from '../models/weather-forecast-backend-data';

/**
 * This service handles weather forecast with URL https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}&units=metric&lang=PL
 */
@Injectable({
  providedIn: 'root'
})
export class WeatherForecastService {

  forecastUrl: string = 'https://api.openweathermap.org/data/2.5/forecast?lat=<LAT>&lon=<LON>&appid=<API_KEY>&units=metric&lang=PL';

  constructor(private httpClient: HttpClient) { }

  getWeatherForecastUrl(apiKey: string, lat: number, lon: number) {
    let url: string = this.forecastUrl;
    return url.replace('<LAT>', lat + '').replace('<LON>' , lon + '').replace('<API_KEY>', apiKey);
  }

  getWeatherForecastData(apiKey: string, lat: number, lon: number): Observable<WeatherForecastInterface | undefined> {
    let url: string = this.forecastUrl;
    url = url.replace('<LAT>', lat + '').replace('<LON>' , lon + '').replace('<API_KEY>', apiKey);

    return this.httpClient.get(url).pipe(
      map(backendData => {
        let dataToParse: WeatherForecastBackendData = (<WeatherForecastBackendData> backendData);

        let weatherForecast: WeatherForecastInterface = {
          cityName: dataToParse.city.name,
          cityCountry: dataToParse.city.country,
          cityCoordLat: dataToParse.city.coord.lat,
          cityCoordLon: dataToParse.city.coord.lon,
          weatherForecasts: []
        };

        for (let list of dataToParse.list) {
          let singleWeatherForecast: SingleWeatherForecastInterface = {
            dt_txt: list.dt_txt,
            sysPod: list.sys.pod,
            main: list.weather[0].main,
            description: list.weather[0].description,
            icon: list.weather[0].icon,
            windDeg: list.wind.deg,
            windGust: list.wind.gust,
            windSpeed: list.wind.speed,
            humidity: list.main.humidity,
            pressure: list.main.pressure,
            sea_level: list.main.sea_level,
            temp: list.main.temp,
            temp_min: list.main.temp_min,
            temp_max: list.main.temp_max
          };

          weatherForecast.weatherForecasts.push(singleWeatherForecast);
        }

        return weatherForecast;
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          return of(undefined);
        } else {
          return throwError(error.error);
        }
      })
    );
  }
}
