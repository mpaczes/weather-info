import { DoCheck, EventEmitter, Injectable, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendLogMessageHandlerService {
  @Output()
  messageChangeEventEmitter: EventEmitter<string> = new EventEmitter();

  constructor() { }

  generateMessage(message: string): void {
    this.messageChangeEventEmitter.emit(message);
  }
}
