import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { timer } from 'rxjs';
import { takeWhile, map } from 'rxjs/operators';

@Injectable()
export class CountdownService {

  private _countdown = new Subject<number>();

  countdown(): Observable<number> {
    return this._countdown.asObservable();
  }

  private isCounting = false;

  start(count: number): void {
    // Ensure that only one timer is in progress at any given time.
    if (!this.isCounting) {
      this.isCounting = true;
      timer(0, 1000).pipe(
        takeWhile(t => t < count),
        map(t => count - t)
      ).subscribe(
        t => this._countdown.next(t),
        null,
        () => {
          this._countdown.complete();
          this.isCounting = false;
          // Reset the countdown Subject so that a 
          // countdown can be performed more than once.
          this._countdown = new Subject<number>();
        }
      );
    }
  }
  
  timeLeft() {
    return this._countdown;
  }
}