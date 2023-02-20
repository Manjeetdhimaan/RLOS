import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable()

export class AppExistGuard implements CanActivate {
    constructor(private router: Router) { }
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean {
        if (this.router.routerState.snapshot.url.indexOf("/journey") > -1 || this.router.routerState.snapshot.url.indexOf("/emi") > -1) {
            return false;
        }
        return true;
    }
}