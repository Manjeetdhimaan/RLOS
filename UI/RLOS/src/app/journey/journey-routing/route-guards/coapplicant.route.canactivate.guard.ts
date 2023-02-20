import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { JourneyService } from '../../_root/journey.service';

@Injectable()

export class ApplicantExistGuard implements CanActivate {
    constructor(private journeyService: JourneyService, private router: Router) { }
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean {
        let applicantObj = this.journeyService.getFromStorage();
        if (applicantObj.arn === null || applicantObj.arn === undefined || applicantObj.arn === '') {
            return false;
        }
        else if (this.router.routerState.snapshot.url.indexOf("/emi") > -1) {
            return false;
        }
        return true;
    }
}