import { Injectable } from '@angular/core';
import { CanDeactivate, Router } from '@angular/router';
import { Observable } from 'rxjs';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable()
export class FinishGuard implements CanDeactivate<CanComponentDeactivate> {
  constructor(private router: Router) { }
  canDeactivate(component: CanComponentDeactivate) {
    if (this.router.routerState.snapshot.url !== "/journey/documents") {
      return false;
    }
    return false;
  }
}