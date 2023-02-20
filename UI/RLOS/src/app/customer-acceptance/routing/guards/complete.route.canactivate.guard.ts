import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable()
export class CompleteGuard implements CanActivate {
    constructor(private router: Router) { }
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean {
        this.router.routeReuseStrategy.shouldReuseRoute = function () {
            return false;
        };
        if (this.router.routerState.snapshot.url.indexOf("customer-acceptance/accept") > -1 && this.router.routerState.snapshot.url.indexOf("/customer-acceptance/details") > -1) {
            return false;
        }
        return true;
    }
}