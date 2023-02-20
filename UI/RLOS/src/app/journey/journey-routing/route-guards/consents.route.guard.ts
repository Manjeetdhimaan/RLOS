import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable()
export class ConsentGuard implements CanActivate {
    constructor(private router: Router) { }
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean {
        if (this.router.routerState.snapshot.url === "") {
            this.router.navigate(['journey/review']);
        }
        else if (this.router.routerState.snapshot.url !== "/journey/review" && this.router.routerState.snapshot.url !== "/auth/resume" && this.router.routerState.snapshot.url !== "/journey/experian") {
            return false;
        }
        return true;
    }
}