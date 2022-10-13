import { TestBed } from '@angular/core/testing';

import { BackendLogMessageHandlerService } from './backend-log-message-handler.service';

describe('BackendLogMessageHandlerService', () => {
  let service: BackendLogMessageHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackendLogMessageHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
