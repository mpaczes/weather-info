import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { Observable, Subscription, of, map, filter } from 'rxjs';

import moment from 'moment';

import { DirectGeocodingInterface } from 'src/app/models/direct-geocoding-interface';
import { DirectGeocodingService } from '../../services/direct-geocoding.service';
import { EventEmitterInterface } from 'src/app/models/event-emitter-interface';
import { BackendLogMessageHandlerService } from 'src/app/services/backend-log-message-handler.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-search-parameters',
  templateUrl: './search-parameters.component.html',
  styleUrls: ['./search-parameters.component.css']
})
export class SearchParametersComponent implements OnInit, OnDestroy {

  weatherTypeInit: string = '';
  isCheckWeatherDisabled: boolean = false;
  backendData!: DirectGeocodingInterface;
  directGeocodingSubscription!: Subscription;
  logsFromBackendMessage: string = 'Logs from backend in format <DATE> - <MESSAGE> :';
  @Output()
  backendDataEmitter: EventEmitter<EventEmitterInterface> = new EventEmitter();
  filteredStateOptions: Observable<string[]> = new Observable();
  filteredCityOptions: Observable<string[] | undefined> = new Observable();
  statesWithCities: Map<string, string[]> = new Map();
  stateCurrent: string = "";
  cityCurrent: string = "";

  constructor(private directGeocodingService: DirectGeocodingService,
    private backendLogMessageHandlerService: BackendLogMessageHandlerService) { }

  ngOnInit(): void {
    this.weatherTypeInit = 'current-weather';
    this.isCheckWeatherDisabled = true;
    this.backendData = { latitude: 0, longtitude: 0, country: '', state: '', name: '' };

    this.statesWithCities.set('kujawsko pomorskie', ['toruń', 'kowal', 'złotoria', 'lubicz', 'włocławek', 'bydgoszcz']);
    this.statesWithCities.set('wielkopolskie', ['poznań', 'kalisz', 'piła']);
    this.statesWithCities.set('pomorskie', ['gdańsk', 'gdynia', 'sopot', 'tczew', 'wejherowo']);
    this.statesWithCities.set('zachodnio pomorskie', ['szczecin', 'koszalin', 'sarbinowo', 'kołobrzeg']);
    this.statesWithCities.set('mazowieckie', ['warszawa', 'radom', 'płock', 'legionowo']);
    this.statesWithCities.set('małopolskie', ['kraków', 'nowy sącz', 'wieliczka', 'bochnia', 'limanowa']);
  
    this.backendLogMessageHandlerService.messageChangeEventEmitter.subscribe(
      messageToLogin => this.logsFromBackendMessage = (this.logsFromBackendMessage + '\n' + messageToLogin)
    );
  }

  ngOnDestroy(): void {
    this.directGeocodingSubscription.unsubscribe();
  }

  setLatAndLong(apiKey: string, stateName: string, cityName: string): void {
    console.log('SearchParametersComponent : apiKey - ' + apiKey + ', stateName - ' + stateName + ', cityName - ' + cityName);

    this.directGeocodingSubscription = this.directGeocodingService.generateDataForDirectGeocoding(apiKey, stateName, cityName)
      .subscribe((data: DirectGeocodingInterface) => {
        this.backendData = data;
  
        this.isCheckWeatherDisabled = false;

        let timestampOfData: string = moment().format('DD MMMM YYYY - HH:mm:ss');

        this.logsFromBackendMessage = (this.logsFromBackendMessage + '\n' + 'RECEIVED - direct geocoding data : ' + timestampOfData);
      },
      (error: HttpErrorResponse) => {
        this.logsFromBackendMessage = (this.logsFromBackendMessage + '\n' + 'ERROR (search parameters) - ' + error.error.message + ', ' + error.message + ', ' + 
          error.status + ', ' + error.statusText + ', ' + error.url);
      });
  }

  checkWeather(form: HTMLFormElement): void {
    console.log('SearchParametersComponent : latitude - ' + form['latitude'] + ', longtitude - ' + form['longtitude'] + ', weatherType - ' + form['weatherType']);

    let timestampOfData: string = moment().format('DD MMMM YYYY - HH:mm:ss');

    this.logsFromBackendMessage = (this.logsFromBackendMessage + '\n' + 'SENT - check weather : ' + timestampOfData + ' - ' + ' latitude - ' + form['latitude'] + ', longtitude - ' + form['longtitude'] + ', weatherType - ' + form['weatherType']);
  
    let eventEmitterData: EventEmitterInterface = { apiKey: form['apiKey'], latitude: form['latitude'], longtitude: form['longtitude'], weatherType: form['weatherType'], stateAndCityName: form['cityName'] + ', ' + form['stateName'] };
    this.backendDataEmitter.emit(eventEmitterData);
  }

  clearBackendLogs() {
    this.logsFromBackendMessage = '';
  }

  doFilterState(): void {
    this.filteredStateOptions = of(this.statesWithCities.keys()).pipe(
      map(states => [...states].filter(state => state.toLowerCase().includes(this.stateCurrent)))
    );
  }

  doFilterCity(): void {
    this.filteredCityOptions = of(this.statesWithCities.get(this.stateCurrent)).pipe(
      map(cities => cities?.filter(city => city.toLowerCase().includes(this.cityCurrent)))
    );
  }

}
