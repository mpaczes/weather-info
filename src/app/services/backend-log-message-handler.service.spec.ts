import { TestBed } from '@angular/core/testing';

import { BackendLogMessageHandlerService } from './backend-log-message-handler.service';

describe('BackendLogMessageHandlerService', () => {
  let service: BackendLogMessageHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ BackendLogMessageHandlerService ]
    });
    service = TestBed.inject(BackendLogMessageHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('generate message with observable', (done: DoneFn) => {
    const expectedMessage = 'message from observable';

    service.getMessageAsObservable().subscribe(
      message => {
        expect(message).toEqual(expectedMessage);
        done();
      }
    );

    service.generateMessageWithObservable(expectedMessage);
  });
});
