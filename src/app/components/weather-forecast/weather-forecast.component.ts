import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { SingleWeatherForecastInterface, WeatherForecastInterface } from 'src/app/models/weather-forecast-interface';
import { BackendLogMessageHandlerService } from 'src/app/services/backend-log-message-handler.service';
import { WeatherForecastService } from 'src/app/services/weather-forecast.service';

import moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-weather-forecast',
  templateUrl: './weather-forecast.component.html',
  styleUrls: ['./weather-forecast.component.css']
})
export class WeatherForecastComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {

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

  weatherForecast!: WeatherForecastInterface;
  forecastSubscription!: Subscription;
  displayedColumns: string[] = [];
  dataSource: any[] = [];
  matTableDataSource!: MatTableDataSource<any>;
  headerNames: Map<string, string> = new Map();
  location: string = '';

  @ViewChild(MatPaginator) 
  paginator!: MatPaginator;
  
  @ViewChild(MatSort) 
  sort!: MatSort;

  constructor(private weatherForecastService: WeatherForecastService,
    private backendLogMessageHandlerService: BackendLogMessageHandlerService) {
    this.matTableDataSource = new MatTableDataSource(this.dataSource);
  }

  ngOnInit(): void {
    if (this.weatherType === 'weather-forecast') {
      console.log('WeatherForecastComponent (ngOnInit) : apiKey - ' + this.apiKey + ', latitude - ' + this.latitude + ', longtitude - ' + this.longtitude);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.weatherType === 'weather-forecast') {
      console.log('WeatherForecastComponent (ngOnChanges) : apiKey - ' + this.apiKey + ', latitude - ' + this.latitude + ', longtitude - ' + this.longtitude);
    
      if (this.apiKey) {
        if (this.forecastSubscription) {
          this.forecastSubscription.unsubscribe();
        }
  
        this.forecastSubscription = this.weatherForecastService.getWeatherForecastData(this.apiKey, this.latitude, this.longtitude).subscribe(
          (weatherForecast: WeatherForecastInterface | undefined) => {
            if (weatherForecast) {
              this.weatherForecast = weatherForecast;

              this.prepareHeadersForTable();
              this.prepareDataForTable();

              let timestampOfData: string = moment().format('DD MMMM YYYY - HH:mm:ss');
              this.backendLogMessageHandlerService.generateMessageWithObservable('RECEIVED - weather forecast data : ' + timestampOfData);
            }
          },
          (error: HttpErrorResponse) => {
            this.backendLogMessageHandlerService.generateMessageWithObservable('ERROR (weather forecast) - ' + error.error.message + ', ' + error.message + ', ' + 
              error.status + ', ' + error.statusText + ', ' + error.url);
          });
      }
    }
  }

  ngOnDestroy(): void {
    if (this.forecastSubscription) {
      this.forecastSubscription.unsubscribe();
    }
  }

  prepareHeadersForTable() {
    // (1)
    this.displayedColumns.splice(0, this.displayedColumns.length);
    this.displayedColumns.push('dtTxt');
    this.displayedColumns.push('main');
    this.displayedColumns.push('description');
    this.displayedColumns.push('icon');
    this.displayedColumns.push('pressure');
    this.displayedColumns.push('seaLevel');
    this.displayedColumns.push('sysPod')
    this.displayedColumns.push('temp')
    this.displayedColumns.push('tempMin');
    this.displayedColumns.push('tempMax');
    this.displayedColumns.push('windDeg');
    this.displayedColumns.push('windSpeed');
    this.displayedColumns.push('windGust');
    // (2)
    this.headerNames.clear();
    this.headerNames.set('dtTxt', 'Date txt');
    this.headerNames.set('main', 'Main');
    this.headerNames.set('description', 'Description');
    this.headerNames.set('icon', 'Icon');
    this.headerNames.set('pressure', 'Pressure');
    this.headerNames.set('seaLevel', 'Sea level');
    this.headerNames.set('sysPod', 'Sys pod');
    this.headerNames.set('temp', 'Temp');
    this.headerNames.set('tempMin', 'Temp min');
    this.headerNames.set('tempMax', 'Temp max');
    this.headerNames.set('windDeg', 'Wind deg');
    this.headerNames.set('windSpeed', 'Wind speed');
    this.headerNames.set('windGust', 'Wind gust');
  }

  prepareDataForTable(): void {
    this.dataSource.splice(0, this.dataSource.length);
    let weatherForecasts: SingleWeatherForecastInterface[] = this.weatherForecast.weatherForecasts;
    for (let weatherForecast of weatherForecasts) {
      let dataForDataSource = {
        dtTxt: weatherForecast.dt_txt,
        main: weatherForecast.main,
        description: weatherForecast.description,
        icon: weatherForecast.icon,
        pressure: weatherForecast.pressure,
        seaLevel: weatherForecast.sea_level,
        sysPod: weatherForecast.sysPod,
        temp: weatherForecast.temp,
        tempMin: weatherForecast.temp_min,
        tempMax: weatherForecast.temp_max,
        windDeg: weatherForecast.windDeg,
        windSpeed: weatherForecast.windSpeed,
        windGust: weatherForecast.windGust
      };

      this.dataSource.push(dataForDataSource);
    }

    this.matTableDataSource.data = this.dataSource;

    this.location = 'Location : ' + this.weatherForecast.cityName + ', ' + this.weatherForecast.cityCountry + ', ' + 
    this.weatherForecast.cityCoordLat + ', ' + this.weatherForecast.cityCoordLon;
  }

  ngAfterViewInit(): void {
    this.matTableDataSource.paginator = this.paginator;
    this.matTableDataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.matTableDataSource.filter = filterValue.trim().toLowerCase();

    if (this.matTableDataSource.paginator) {
      this.matTableDataSource.paginator.firstPage();
    }
  }

  isColumnSticky(columnDef: string): boolean {
    return (columnDef === 'dtTxt' || columnDef === 'main') ? true : false;
  }

}
