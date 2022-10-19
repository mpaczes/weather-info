import { Component } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { EventEmitterInterface } from './models/event-emitter-interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  apiKey: string = '';
  latitude: number = 0;
  longtitude: number = 0;
  weatherType: string = '';
  stateAndCityName: string = '';

  backendDataReceiver(event: EventEmitterInterface, tabs: MatTabGroup) {
    this.apiKey = event.apiKey;
    this.latitude = event.latitude;
    this.longtitude = event.longtitude
    this.weatherType = event.weatherType;
    this.stateAndCityName = event.stateAndCityName;

    if (event.weatherType === 'current-weather') {
      tabs.selectedIndex = 1;
    } else if (event.weatherType === 'weather-forecast') {
      tabs.selectedIndex = 2;
    }
  }

}
