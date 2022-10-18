import { DoCheck, EventEmitter, Injectable, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendLogMessageHandlerService {

  private messageSubject = new Subject<string>();

  constructor() { }

  generateMessageWithObservable(message: string): void {
    this.messageSubject.next(message);
  }

  getMessageAsObservable(): Observable<string> {
    return this.messageSubject.asObservable();
  }

}
