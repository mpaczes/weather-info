import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { BackendLogMessageHandlerService } from 'src/app/services/backend-log-message-handler.service';
import { CurrentWeatherService } from 'src/app/services/current-weather.service';

import { CurrentWeatherComponent } from './current-weather.component';

import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement, SimpleChange } from '@angular/core';

describe('CurrentWeatherComponent: unit test', () => {
  let component: CurrentWeatherComponent;
  let fixture: ComponentFixture<CurrentWeatherComponent>;

  let backendLogMessageHandlerService: BackendLogMessageHandlerService;
  let currentWeatherService: CurrentWeatherService;

  let weatherMainDe: DebugElement;
  let weatherMainEl: any;

  let weatherIconDe: DebugElement;
  let weatherIconEl: any;

  let mainTempDe: DebugElement;
  let mainTempEl: any;

  let windSpeedDe: DebugElement;
  let windSpeedEl: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentWeatherComponent ],
      providers: [ BackendLogMessageHandlerService, CurrentWeatherService ],
      imports: [ HttpClientTestingModule ]
    });

    fixture = TestBed.createComponent(CurrentWeatherComponent);
    component = fixture.componentInstance;

    backendLogMessageHandlerService = fixture.debugElement.injector.get(BackendLogMessageHandlerService);
    currentWeatherService = fixture.debugElement.injector.get(CurrentWeatherService);
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('check current weather data values in the component after call ngOnChanges()', () => {
    spyOn(currentWeatherService, 'generateDataForCurrentWeather').and.returnValue(of(currentWeatherService.getStaticData()));
  
    component.apiKey = '112233';
    component.weatherType = 'current-weather';
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

    expect(component.currentWeatherData.weatherMain).toBe('Clouds');
    expect(component.currentWeatherData.weatherIcon).toBe('02n');
    expect(component.currentWeatherData.mainTemp).toBe(9.95);
    expect(component.currentWeatherData.windSpeed).toBe(2.96);
  });

  it('check values in the template after call ngOnChanges()', () => {
    spyOn(currentWeatherService, 'generateDataForCurrentWeather').and.returnValue(of(currentWeatherService.getStaticData()));
  
    weatherMainDe = fixture.debugElement.query(By.css('#weatherMain'));
    weatherMainEl = weatherMainDe.nativeElement;

    weatherIconDe = fixture.debugElement.query(By.css('#weatherIcon'));
    weatherIconEl = weatherIconDe.nativeElement;

    mainTempDe = fixture.debugElement.query(By.css('#mainTemp'));
    mainTempEl = mainTempDe.nativeElement;

    windSpeedDe = fixture.debugElement.query(By.css('#windSpeed'));
    windSpeedEl = windSpeedDe.nativeElement;

    component.apiKey = '112233';
    component.weatherType = 'current-weather';
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

    expect(weatherMainEl.textContent).toContain('Clouds');
    expect(weatherIconEl.textContent).toContain('02n');
    expect(mainTempEl.textContent).toContain('9.95');
    expect(windSpeedEl.textContent).toContain('2.96');
  });

});
