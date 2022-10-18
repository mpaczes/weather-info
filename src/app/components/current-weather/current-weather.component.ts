import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { CurrentWeatherInterface } from 'src/app/models/current-weather-interface';
import { BackendLogMessageHandlerService } from 'src/app/services/backend-log-message-handler.service';
import { CurrentWeatherService } from 'src/app/services/current-weather.service';

import moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-current-weather',
  templateUrl: './current-weather.component.html',
  styleUrls: ['./current-weather.component.css']
})
export class CurrentWeatherComponent implements OnInit, OnChanges, OnDestroy {

  @Input()
  apiKey: string = '';

  @Input()
  latitude: number = 0;

  @Input()
  longtitude: number = 0;

  @Input()
  weatherType: string = '';

  @Input()
  stateAndCityName: string = '';

  currentWeatherData: CurrentWeatherInterface = { 
    weatherMain: '', weatherDescription: '', weatherIcon: '',
    windDeg: 0, windGust: 0, windSpeed: 0,
    mainFeelsLike: 0, mainHumidity: 0, mainPressure: 0, mainTemp: 0, mainTempMax: 0, mainTempMin: 0,
    dt: 0
  };
  currentWeatherSubscription!: Subscription;

  constructor(private currentWeatherService: CurrentWeatherService,
    private backendLogMessageHandlerService: BackendLogMessageHandlerService) {
  }

  ngOnInit(): void {
    if (this.weatherType === 'current-weather') {
      console.log('CurrentWeatherComponent (ngOnInit) : apiKey - ' + this.apiKey + ', latitude - ' + this.latitude + ', longtitude - ' + this.longtitude);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.weatherType === 'current-weather') {
      console.log('CurrentWeatherComponent (ngOnChanges) : apiKey - ' + this.apiKey + ', latitude - ' + this.latitude + ', longtitude - ' + this.longtitude);
    
      if (this.apiKey) {
        if (this.currentWeatherSubscription) {
          this.currentWeatherSubscription.unsubscribe();
        }
  
        this.currentWeatherSubscription = this.currentWeatherService.generateDataForCurrentWeather(this.apiKey, this.latitude, this.longtitude).subscribe(
          (currentWeatherData: CurrentWeatherInterface | undefined) => {
            if (currentWeatherData) {
              this.currentWeatherData = currentWeatherData;

              let timestampOfData: string = moment().format('DD MMMM YYYY - HH:mm:ss');
              this.backendLogMessageHandlerService.generateMessageWithObservable('RECEIVED - current weather data : ' + timestampOfData);
            }
        },
        (error: HttpErrorResponse) => {
          this.backendLogMessageHandlerService.generateMessageWithObservable('ERROR (current weather) - ' + error.error.message + ', ' + error.message + ', ' + 
            error.status + ', ' + error.statusText + ', ' + error.url);
        });
      }
    }
  }

  ngOnDestroy(): void {
    if (this.currentWeatherSubscription) {
      this.currentWeatherSubscription.unsubscribe();
    }
  }

}
