import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable()
export class AppStartGuard implements CanActivate {
    constructor(private router: Router) { }
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean {
        if (this.router.routerState.snapshot.url.indexOf("/documents") > -1 || this.router.routerState.snapshot.url.indexOf("/emi") > -1 || this.router.routerState.snapshot.url.indexOf("/applicant") > -1 || this.router.routerState.snapshot.url.indexOf("/coapplicant") > -1 || this.router.routerState.snapshot.url.indexOf("/loan") > -1 || this.router.routerState.snapshot.url.indexOf("/review") > -1 || this.router.routerState.snapshot.url.indexOf("/consents") > -1) {
            return false;
        }
        return true;
    }
}