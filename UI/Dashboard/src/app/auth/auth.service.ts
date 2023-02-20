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

        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        // let httpHeaders = new HttpHeaders({
        //     'Content-Type': 'application/json'
        // });

        // this.httpOptions = {
        //     headers: httpHeaders,
        //     observe: 'response'
        // };
    }

    validateApplication(data): Observable<any> {
        return this.http.post<any>(environment.apiURL + "/api/applications/VALIDATE", data, this.httpOptions)
            .pipe(map(response => {
                return response;
            }
            ));
    }
    validateResume(data): Observable<any> {
        // this.httpOptions = {
        //     body: 'response',
        //     headers: new HttpHeaders({
        //         'Content-Type': 'application/json'
        //     }),
        //     observe: 'response'
        // };
        return this.http.post<any>(environment.apiURL + "/api/application/Resume/", data, this.httpOptions)
            .pipe(map(response => {
                return response;
            }
            ));
    }


    getApplicationDetails(data): Observable<any> {
        return this.http.post<any>(environment.apiURL + "/api/searchCustomer", data, this.httpOptions)
            .pipe(map(response => {
                return response;
            }));
    }

    validateOtp(data): Observable<any> {
        return this.http.post<any>(environment.apiURL + "/api/verifyOTP", data, this.httpOptions)
            .pipe(map(response => {
                return response;
            }));
    }

    resendOtp(data): Observable<any> {
        return this.http.post<any>(environment.apiURL + "/api/resendOTP", data, this.httpOptions)
            .pipe(map(response => {
                return response;
            }));
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
        return require('../../assets/configs/journey/validation-values.json');
    }

    getLookupData(): Observable<any> {
        return this.http.get<any>(environment.apiURL + "/api/master/en/JOURNEY/")
            .pipe(map(response => {
                this.setLookupInStorage(response);
                return response;
            }));
    }

    getFromStorage() {
        if (sessionStorage.getItem('ANBTX.APP')) {
            return JSON.parse(sessionStorage.getItem('ANBTX.APP'));
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
    getRLOSData(appType, securityQues): Observable<any> {
        return this.http.get<any>(environment.apiURL + "/api/application/234567")
            .pipe(map(response => {
                return response;
            }));
    }



    getAOData(appType, securityQues): Observable<any> {
        return this.http.get<any>(environment.apiURL + "/api/application/234567")
            .pipe(map(response => {
                return response;
            }));
    }

    getQuestions(appType, arn): Observable<any> {
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };


        if (!environment.production) {
            environment.apiURL = 'http://192.168.35.44:8094/ao';
        }
        environment.apiURL = (appType.toLowerCase().indexOf('ao') > -1) ? environment.apiURL.replace("rlos", "ao") : environment.apiURL.replace("ao", "rlos");

        return this.http.get<any>(environment.apiURL + "/api/applications/questions/" + arn, this.httpOptions)
            .pipe(map(response => {
                return response;
            }))
    }

    verifyApplication(questions, arn): Observable<any> {
        let httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        this.httpOptions = {
            headers: httpHeaders,
            observe: 'response'
        };

        return this.http.post(environment.apiURL + "/api/applications/VERIFY/" + arn, questions, this.httpOptions)
            .pipe(map((response: any) => {
                return response;
            }));
    }

}