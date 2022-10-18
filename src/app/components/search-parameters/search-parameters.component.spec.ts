import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { BackendLogMessageHandlerService } from 'src/app/services/backend-log-message-handler.service';
import { DirectGeocodingService } from 'src/app/services/direct-geocoding.service';

import { SearchParametersComponent } from './search-parameters.component';

import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { HttpClientModule } from '@angular/common/http';

import moment from 'moment';
import { of } from 'rxjs';

describe('SearchParametersComponent', () => {
  let component: SearchParametersComponent;
  let fixture: ComponentFixture<SearchParametersComponent>;

  let backendLogMessageHandlerService: BackendLogMessageHandlerService;
  let directGeocodingService: DirectGeocodingService;

  let mockData: string = '';
  // let logsFromBackendMessage: string = 'Logs from backend in format <DATE> - <MESSAGE> :';

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchParametersComponent ],
      providers: [ BackendLogMessageHandlerService, DirectGeocodingService ],
      imports: [ FormsModule, MatAutocompleteModule, HttpClientModule ]
    })
    .compileComponents();

    let timestampOfData: string = moment('2022-10-15 8:25:42', 'YYYY-M-D HH:mm:ss').format('DD MMMM YYYY - HH:mm:ss');
    let parsedMockData: string = 'RECEIVED - current weather data : <TIMESTAMP>';
    mockData = parsedMockData.replace('<TIMESTAMP>', timestampOfData);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchParametersComponent);
    component = fixture.componentInstance;

    backendLogMessageHandlerService = TestBed.inject(BackendLogMessageHandlerService);
    directGeocodingService = TestBed.inject(DirectGeocodingService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('testing subsribe method is getting called', fakeAsync(() => {
    let backendLogDataSpy = spyOn(backendLogMessageHandlerService, 'getMessageAsObservable').and.returnValue(of(mockData));
    let subscriptionSpy = spyOn(backendLogMessageHandlerService.getMessageAsObservable(), 'subscribe');

    component.ngOnInit();
    tick();
    
    expect(backendLogDataSpy).toHaveBeenCalledBefore(subscriptionSpy);
    expect(subscriptionSpy).toHaveBeenCalled();
  }));

  it('testing execution within subscribe method', fakeAsync(() => {
    spyOn(backendLogMessageHandlerService, 'getMessageAsObservable').and.returnValue(of(mockData));

    component.ngOnInit();
    tick();

    expect(component.logsFromBackendMessage).toBeDefined();
    expect(component.logsFromBackendMessage).toContain('RECEIVED - current weather data :');
  }));

});
