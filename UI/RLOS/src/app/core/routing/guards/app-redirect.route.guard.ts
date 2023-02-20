import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthenticationService, PersistanceService } from '../../services';
// import { PersistanceService } from './services/persistence.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { JourneyService } from 'src/app/journey/_root/journey.service';
//import { environment } from 'environments/environment.prod';//Hemlata Commented
import { environment } from 'environments/environment';


@Injectable()

export class AppRedirectGuard implements CanActivate {
    constructor(private router: Router, private JourneyService: JourneyService, private authenticationService: AuthenticationService, private persistanceService: PersistanceService, private spinner: NgxSpinnerService) { }
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean {
        //redirect to document module
        if (route.queryParams && route.queryParams.arn && route.queryParams.context) {
            this.persistanceService.setConfig({ state: { context: route.queryParams.context } })
            this.persistanceService.setApplication({ arn: route.queryParams.arn });
            this.router.navigate(['auth/resume']);
        }
        else if (route.queryParams && route.queryParams.product) {
            var appData = this.JourneyService.getFromStorage() || { applicants: [{ type: 'Primary Applicant' }] };
            this.persistanceService.getLookupData('RLOS').subscribe(lookup => {
                if (environment.isMockingEnabled) //For Mock Server
                    this.persistanceService.setLookupStorage(lookup);//Hemlata For Mock
                else
                    this.persistanceService.setLookupStorage(lookup.data);//For Actual Server

                appData.preferences = null;
                appData.additionalInfo = null;

                let loanType = route.queryParams.product;
                let loanTypeList = this.persistanceService.getLoanProductList();
                let product = loanTypeList.find(lt => lt.label === loanType).loanType;

                appData.loanDetails = {
                    product: product,
                    loanType: loanType
                }
                this.persistanceService.setInStorage('APP', appData);
                this.router.navigate(['']);
            });
        }
        else if (route.queryParams && route.queryParams.arn && route.queryParams.key) {
            this.persistanceService.setToken(route.queryParams.key);
            this.persistanceService.getLookupData('RLOS').subscribe((lookup) => {
                if (lookup) {
                    this.persistanceService.setLookupStorage(lookup.data);
                    this.persistanceService.getApplicationData(route.queryParams.arn).subscribe((response) => {
                        if (response && response.success && response.data) {
                            this.persistanceService.setInStorage('APP', response.data);
                            this.setMessage(response.data.arn);// to set arn in session storage
                            let preferenceData = response.data.preferences;
                            this.persistanceService.navigateRoute(preferenceData);
                        }
                    });
                }
            });
        }
        else {
            this.router.navigate(['error']);
        }
        return true;
    }

    setMessage(value: string): void {
        this.persistanceService.setStorageItem({
            key: "JMMB.ARN",
            value,
            storageArea: "sessionStorage"
        });
    }
}