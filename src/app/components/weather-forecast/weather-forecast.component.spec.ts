import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { DebugElement, SimpleChange } from '@angular/core';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { BackendLogMessageHandlerService } from 'src/app/services/backend-log-message-handler.service';
import { WeatherForecastService } from 'src/app/services/weather-forecast.service';
import { WeatherForecastComponent } from './weather-forecast.component';

describe('WeatherForecastComponent', () => {
  let component: WeatherForecastComponent;
  let fixture: ComponentFixture<WeatherForecastComponent>;

  let weatherForecastService: WeatherForecastService;
  let backendLogMessageHandlerService: BackendLogMessageHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ WeatherForecastComponent ],
      providers: [ WeatherForecastService, BackendLogMessageHandlerService ],
      imports: [ HttpClientTestingModule ]
    });

    fixture = TestBed.createComponent(WeatherForecastComponent);
    component = fixture.componentInstance;

    weatherForecastService = fixture.debugElement.injector.get(WeatherForecastService);
    backendLogMessageHandlerService = fixture.debugElement.injector.get(BackendLogMessageHandlerService);
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(weatherForecastService).toBeDefined();
    expect(backendLogMessageHandlerService).toBeDefined();
  });

  it('check component values when there is no data sent from the backend', fakeAsync(() => {
    spyOn(weatherForecastService, 'getWeatherForecastData').and.returnValue(of());

    component.apiKey = '112233';
    component.weatherType = 'weather-forecast';
    component.latitude = 53.0153;
    component.longtitude = 18.6057;
    component.stateAndCityName = 'kujawsko pomorskie, Toruń';

    component.ngOnChanges({
      apiKey: new SimpleChange(null, component.apiKey, true),
      weatherType: new SimpleChange(null, component.weatherType, true),
      latitude: new SimpleChange(null, component.latitude, true),
      longtitude: new SimpleChange(null, component.longtitude, true),
      stateAndCityName: new SimpleChange(null, component.stateAndCityName, true)
    });

    fixture.detectChanges();
    tick();

    expect(component.displayedColumns.length).toBe(0);
    expect(component.headerNames.size).toBe(0);
    expect(component.dataSource.length).toBe(0);
  }));

  it('check component values when backend sent correct data', fakeAsync(() => {
    spyOn(weatherForecastService, 'getWeatherForecastData').and.returnValue(of(weatherForecastService.prepareWeatherForecastData(weatherForecastService.getStaticData())));
  
    component.apiKey = '112233';
    component.weatherType = 'weather-forecast';
    component.latitude = 53.0153;
    component.longtitude = 18.6057;
    component.stateAndCityName = 'kujawsko pomorskie, Toruń';
    
    component.ngOnChanges({
      apiKey: new SimpleChange(null, component.apiKey, true),
      weatherType: new SimpleChange(null, component.weatherType, true),
      latitude: new SimpleChange(null, component.latitude, true),
      longtitude: new SimpleChange(null, component.longtitude, true),
      stateAndCityName: new SimpleChange(null, component.stateAndCityName, true)
    });

    fixture.detectChanges();
    tick();

    expect(component.displayedColumns.length).toBe(13);
    expect(component.headerNames.size).toBe(13);
    expect(component.dataSource.length).toBe(2);
  }));

});
