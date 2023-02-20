import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthenticationService, PersistanceService } from '../../services';
// import { PersistanceService } from './services/persistence.service';

@Injectable()

export class AppRedirectGuard implements CanActivate {
    constructor(private router: Router, private authenticationService: AuthenticationService, private persistanceService: PersistanceService) { }
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean {
        //redirect to document module
        if (route.queryParams && route.queryParams.arn && route.queryParams.context) {
            this.persistanceService.setConfig({ state: { context: route.queryParams.context } })
            this.persistanceService.setApplication({ arn: route.queryParams.arn });
            this.router.navigate(['auth/resume']);
        }
       
        else {
            this.router.navigate(['error']);
        }
        return true;
    }
}