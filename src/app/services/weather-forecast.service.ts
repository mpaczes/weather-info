import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { WeatherForecastBackendData } from '../models/weather-forecast-backend-data';
import { SingleWeatherForecastInterface, WeatherForecastInterface } from '../models/weather-forecast-interface';

/**
 * This service handles weather forecast with URL https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}&units=metric&lang=PL
 */
@Injectable({
  providedIn: 'root'
})
export class WeatherForecastService {

  forecastUrl: string = 'https://api.openweathermap.org/data/2.5/forecast?lat=<LAT>&lon=<LON>&appid=<API_KEY>&units=metric&lang=PL';

  constructor(private httpClient: HttpClient) { }

  getWeatherForecastUrl(apiKey: string, lat: number, lon: number): string {
    let url: string = this.forecastUrl;
    return url.replace('<LAT>', lat + '').replace('<LON>' , lon + '').replace('<API_KEY>', apiKey);
  }

  getWeatherForecastData(apiKey: string, lat: number, lon: number): Observable<WeatherForecastInterface | undefined> {
    let url: string = this.getWeatherForecastUrl(apiKey, lat, lon);

    return this.httpClient.get(url).pipe(
      map(backendData => {
        let dataToParse: WeatherForecastBackendData = (<WeatherForecastBackendData> backendData);
        return this.prepareWeatherForecastData(dataToParse);
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

  prepareWeatherForecastData(dataToParse: WeatherForecastBackendData): WeatherForecastInterface {
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
  }

  getStaticData(): WeatherForecastBackendData {
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

    return backendData;
  }
}
