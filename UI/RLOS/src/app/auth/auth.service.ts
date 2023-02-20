import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { catchError, finalize, map, tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

declare var require: any;
@Injectable({
    providedIn: 'root'
})
export class AuthService {

    httpOptions;
    applicationURL;
    applicantURL;
    idScanURL;

    constructor(private http: HttpClient) {

        let httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        this.httpOptions = {
            headers: httpHeaders,
            observe: 'response'
        };
    }

    validateApplication(data): Observable<any> {
        return this.http.post<any>(environment.apiURL + "/api/applications/VALIDATE", data, this.httpOptions)
            .pipe(map(response => {
                return response;
            }
            ));
    }

    saveExperianData(request) {
        let application = this.getFromStorage();
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
            // observe: 'response'
        };
        return this.http.post(environment.apiURL + `/api/externalservice/experian/answers?refNumber=${request.refNumber}`, request.expValues, this.httpOptions)
            .pipe(map((response: any) => {
                return response;
            }
            ));
    }

    getValidationValues() {
        return require('../../assets/validators/journey/validation-values.json');
    }



    getLookupData(processName): Observable<any> {
        try {
            //if mocking enabled
            if (environment.isMockingEnabled) {
                console.log('jsons')
                return this.http.get('assets/resources/mocks/mdm.json');
            }
            //api call
            else {
                //http://192.168.152.137:8180/rlos/lookup/master/processName
                return this.http.get<any>(environment.apiURL + "/api/lookup/master" + '?processName=' + processName)
                    .pipe(map(response => {
                        return response;
                    }));
            }
        } catch (exception) {
            console.log(exception.message)
        }

    }

    getFromStorage() {
        if (sessionStorage.getItem('JMMB.APP')) {
            return JSON.parse(sessionStorage.getItem('JMMB.APP'));
        } else {
            return {};
        }
    }

    setLookupInStorage(data) {
        var lookupData = this.getLookupFromStorage();
        lookupData = Object.assign({}, lookupData, data);
        sessionStorage.setItem('lookupData', JSON.stringify(lookupData));
    };

    getLookupFromStorage() {
        if (sessionStorage.getItem('lookupData')) {
            return JSON.parse(sessionStorage.getItem('lookupData'));
        } else {
            return {};
        }
    }

    getState() {
        let lookupData = this.getLookupFromStorage();
        if (lookupData) {
            return lookupData.COMMON_STATE;
        }
        return require('../../resources/mocks/state.json');
    }
    getLoanProduct() {
        const lookupData = this.getLookupFromStorage();
        if (lookupData) {
            return lookupData.Common_Product_Types;
        }
        return require('../../resources/mocks/Others.json');
    }
    getCollateralType() {
        const lookupData = this.getLookupFromStorage();
        if (lookupData) {
            return lookupData.COMMON_Collateral_Type;
        }
        return require('../../resources/mocks/Others.json');
    }
    getExperianData(application, refNumber) {
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
            // observe: 'response'
        };
        return this.http.post(environment.apiURL + `/api/externalservice/experian/questions?refNumber=${refNumber}`, application, this.httpOptions)
            .pipe(map(response => {
                return response;
            }
            ));
    }


    validateApplicationWithIBPS(data): Observable<any> {
        return this.http.post<any>(environment.apiURL + "/api/ibps/applications/VALIDATE?arn=" + data.arn + "&ssn=" + data.ssn + "&dob=" + data.dateOfBirth, data, this.httpOptions)
            .pipe(map(response => {
                return response;
            }
            ));
    }
    getApplication(arn): Observable<any> {
        return this.http.get(environment.apiURL + "/api/applications/" + arn, this.httpOptions)
            .pipe(map(response => {
                return response;
            }
            ));
    }

    getLoanData(arn) {
        return this.http.get(environment.apiURL + `/api/ibps/applications/${arn}/loan/SNAPSHOT`)
            .pipe(map(response => {
                return response;
            }));
    };
}
