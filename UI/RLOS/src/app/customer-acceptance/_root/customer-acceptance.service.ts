import { Injectable, isDevMode } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { catchError, finalize, map, tap } from 'rxjs/operators';
import { Observable, Subject, throwError, of } from 'rxjs';

import { ApiService, PersistanceService } from '../../core/services';
import { environment } from '../../../../environments/environment';
import { DOMHelperService } from '../../shared';
// import { JourneyService } from '../../journey/_root/journey.service';


declare var require: any;
var jsonpatch = require('fast-json-patch');

@Injectable()
export class CustomerAcceptanceService {
    private subject = new Subject<any>();
    httpOptions;
    applicationURL;
    applicantURL;
    idScanURL;
    response: any = [];

    steps = ['Home', 'Applicant Information', 'Co-Applicant Information', 'Loan & Collateral Information', 'Review', 'Consents', 'Complete'];
    currentStep = 0;
    backFlag = false;
    constructor(private apiService: ApiService, private persistanceService: PersistanceService, private http: HttpClient, private _dom: DOMHelperService) {
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
    }

    getHoursList() {
        let hours = [];
        for (let i = 0; i <= 12; i++)
            hours.push("" + i + "");
        return hours;
    }

    getMinutesList() {
        let minutes = [];
        for (let i = 0; i <= 59; i++)
            minutes.push("" + i + "");
        return minutes;
    }

    getLoanProductType() {
        let lookupData = this.persistanceService.getFromLookupStorage();
        if (lookupData) {
            return lookupData.COMMON_Loan_Product;
        }
        return require('../../../resources/mocks/loanType.json');
    }

    getFromJourneyStorage() {
        return this.persistanceService.getFromJourneyStorage();
    }

    getLoanData() {
        let application = this.getFromJourneyStorage();
        return this.http.get(environment.apiURL + `/api/ibps/applications/${application.arn}/loan/SNAPSHOT`)
            .pipe(map(response => {
                return response;
            }));
    }

    submitCustomerAcceptance(data, status): Observable<any> {
        let application = this.getFromJourneyStorage();
        return this.http.post<any>(environment.apiURL + `/api/ibps/applications/${application.arn}/loan/CLOSINGDETAILS?status=${status}`, data, this.httpOptions)
            .pipe(map(response => {
                return response;
            }
            ));
    }
}