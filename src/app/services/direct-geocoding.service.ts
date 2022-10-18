import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, defer, map, Observable, of, throwError } from 'rxjs';
import { DirectGeocodingBackend } from '../models/direct-geocoding-backend';
import { DirectGeocodingInterface } from '../models/direct-geocoding-interface';

/**
 * This service handles direct geocoding with URL 'http://api.openweathermap.org/geo/1.0/direct?q={city},{state},{country}&limit=1&appid={api_key}'
 * 
 * Here is an example of valid URL 'http://api.openweathermap.org/geo/1.0/direct?q=toruń,kujawsko pomorskie,PL&limit=1&appid=799b0868d04c2accde4c7e8836ced7ae'
 */
@Injectable({
  providedIn: 'root'
})
export class DirectGeocodingService {

  directGeoCodingUrl: string = 'http://api.openweathermap.org/geo/1.0/direct?q=<CITY>,<STATE>,PL&limit=1&appid=<API_KEY>';

  constructor(private http: HttpClient) { }

  getDirectGeocodingUrl(apiKey: string, stateName: string, cityName: string) {
    let url: string = this.directGeoCodingUrl;
    return url.replace('<CITY>', cityName).replace('<STATE>', stateName).replace('<API_KEY>', apiKey);
  }

  generateDataForDirectGeocoding(apiKey: string, stateName: string, cityName: string): Observable<DirectGeocodingInterface | undefined> {
    let url: string = this.directGeoCodingUrl;
    url = url.replace('<CITY>', cityName).replace('<STATE>', stateName).replace('<API_KEY>', apiKey);
    
    return this.http.get(url).pipe(
      map(backendData => {
        let dataFromBackend: DirectGeocodingBackend[] = (<DirectGeocodingBackend[]> backendData);

        let directGeocodingData: DirectGeocodingInterface = {
          latitude: dataFromBackend[0].lat,
          longtitude:dataFromBackend[0].lon,
          name: dataFromBackend[0].name,
          state: dataFromBackend[0].state,
          country: dataFromBackend[0].country
        };

        return directGeocodingData;
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

  getStaticData(): DirectGeocodingInterface {
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

      let directGeocodingData: DirectGeocodingInterface = {
        latitude: backendData[0].lat,
        longtitude:backendData[0].lon,
        name: backendData[0].name,
        state: backendData[0].state,
        country: backendData[0].country
      };

    return directGeocodingData;
  }
  
}
