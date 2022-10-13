import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';

import { SingleWeatherForecastInterface, WeatherForecastInterface } from '../models/weather-forecast-interface';

interface WeatherForecastBackendData {
  cod: string,
  message: number,
  cnt: number,
  city: City,
  list: List[]
}

interface Coord {
  lat: number,
  lon: number
}

interface City {
  id: number,
  name: string,
  coord: Coord,
  country: string,
  population: number,
  timezone: number,
  sunrise: number,
  sunset: number
}

interface Sys {
  pod: string
}

interface Rain {
  '3h': number
}

interface Wind {
  speed: number,
  deg: number,
  gust: number
}

interface Clouds {
  all: number
}

interface Weather  {
  id: number,
  main: string,
  description: string,
  icon: string
}

interface Main {
  temp: number,
  feels_like: number,
  temp_min: number,
  temp_max: number,
  pressure: number,
  sea_level: number,
  grnd_level: number,
  humidity: number,
  temp_kf: number
}

interface List {
  dt: number,
  main: Main,
  weather: Weather[],
  clouds: Clouds,
  wind: Wind,
  visibility: number,
  pop: number,
  rain: Rain,
  sys: Sys,
  dt_txt: string
}

/**
 * This service handles weather forecast with URL https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}&units=metric&lang=PL
 */
@Injectable({
  providedIn: 'root'
})
export class WeatherForecastService {

  forecastUrl: string = 'https://api.openweathermap.org/data/2.5/forecast?lat=<LAT>&lon=<LON>&appid=<API_KEY>&units=metric&lang=PL';

  constructor(private httpClient: HttpClient) { }

  getWeatherForecastData(apiKey: string, lat: number, lon: number): Observable<WeatherForecastInterface> {
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
      })
    );
  }
}
