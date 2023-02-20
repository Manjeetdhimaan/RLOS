import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { catchError, finalize, map, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

declare var require: any;
export interface StorageChange {
    key: string;
    value: string;
    storageArea: "localStorage" | "sessionStorage";
}
@Injectable()
export class PersistanceService {

    public storageChange$: ReplaySubject<StorageChange> = new ReplaySubject();
    private CACHE_PREFIX: string = 'JMMB';

    private KEYS: Object = {
        USER: 'USER',
        APP: 'APP',
        TOKEN: 'TOKEN',
        TOKEN_GENEARTION_TIME: 'TOKEN_GENEARTION_TIME',
        APP_STATUS: 'APP_STATUS',
        LAST_STATE: 'LAST_STATE',
        JOURNEY_CONFIG: 'JOURNEY_CONFIG',
        GLOBAL_CONFIG: 'GLOBAL_CONFIG',
        JMMB_CONFIG: 'JMMB_CONFIG',
        ARN: 'ARN',
        JMMB_LOAN: 'JMMB_LOAN'
    };
    httpOptions;
    applicationURL;
    applicantURL;

    constructor(
        private _router: Router, private http: HttpClient) {
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
    }

    setInStorage(key, value) {
        sessionStorage.setItem(this.CACHE_PREFIX + '.' + key, JSON.stringify(value));
    };

    getFromStorage(key) {
        if (sessionStorage.getItem(this.CACHE_PREFIX + '.' + key)) {
            return JSON.parse(sessionStorage.getItem(this.CACHE_PREFIX + '.' + key));
        } else {
            return null;
        }
    };

    getFromSessionStorage(key) {
        if (environment.isMockingEnabled) {
            return require('src/assets/resources/mocks/session-config.json');
        } else {
            return JSON.parse(sessionStorage.getItem(this.CACHE_PREFIX + '.' + key));
        }
    };

    getFromJourneyStorage() {
        if (sessionStorage.getItem('JMMB.APP')) {
            return JSON.parse(sessionStorage.getItem('JMMB.APP'));
        } else {
            return null;
        }
    }
    getConfigFromJourneyStorage() {
        if (sessionStorage.getItem('JMMB.JMMB_CONFIG')) {
            return JSON.parse(sessionStorage.getItem('JMMB.JMMB_CONFIG'));
        } else {
            return null;
        }
    }

    getARNFromJourneyStorage() {
        if (sessionStorage.getItem('JMMB.ARN')) {
            return JSON.parse(sessionStorage.getItem('JMMB.ARN'));
        } else {
            return null;
        }
    }

    getFromLookupStorage() {
        if (sessionStorage.getItem('lookupData')) {
            return JSON.parse(sessionStorage.getItem('lookupData'));
        } else {
            return null;
        }
    }


    getLookupData(processName): Observable<any> {
        try {
            // return this.http.get<any>(environment.apiURL + "/api/lookup/master" + '?processName=' + processName)
            //     .pipe(map(response => {
            //         return response;
            //     }));
            // if mocking enabled
            if (environment.isMockingEnabled) {
                console.log('persistence', this.http.get('src/assets/resources/mocks/mdm.json'))
                return this.http.get('assets/resources/mocks/mdm.json');
            }
            //api call
            else {
                return this.http.get<any>(environment.apiURL + "/api/lookup/master" + '?processName=' + processName)
                    .pipe(map(response => {
                        return response;
                    }));
            }
        } catch (exception) {
            console.log(exception.message)
        }

    }

    scheduleAppointment(data): Observable<any> {
        let arn = this.getARNFromJourneyStorage()
        return this.http.post<any>(environment.apiURL + "/api/applications/" + arn + "/scheduleAppointment", data, this.httpOptions)
            .pipe(map(response => {
                return response;
            }));
    }


    getLoanProductList() {
        let lookupData = this.getLookupFromStorage();
        if (lookupData) {
            return lookupData.COMMON_Loan_Product;
        }
    }

    getLoanProduct() {
        try {
            let appData = this.getFromJourneyStorage();
            if (appData) {
                return appData.loanName.product;
            }
        }
        catch (exception) {
            console.log(exception.message)
        }
    }

    getLoan() {
        try {
            let dto = this.getFromJourneyStorage().loanName;
            let loanTypeList = this.getLoanProductList();
            let loanType = loanTypeList.find(lt => lt.label === dto.product).label;
            return loanType;
        }
        catch (exception) {
            console.log(exception.message)
        }
    }


    setInJourneyStorage(data) {
        var appData = this.getFromJourneyStorage();
        appData = Object.assign({}, appData, data);
        sessionStorage.setItem('JMMB.APP', JSON.stringify(appData));
    };

    removeInJourneyFromStorage() {
        return sessionStorage.removeItem('JMMB.APP');
    };

    setARNInStorage(data) {
        sessionStorage.setItem('JMMB.ARN', JSON.stringify(data));
    }

    removeARNFromStorage(key) {
        return sessionStorage.removeItem(this.CACHE_PREFIX + '.' + key);
    };

    setLookupStorage(data) {
        var lookupData = this.getFromLookupStorage();
        lookupData = Object.assign({}, lookupData, data);
        sessionStorage.setItem('lookupData', JSON.stringify(lookupData));
    };

    removeFromStorage(key) {
        return sessionStorage.removeItem(this.CACHE_PREFIX + '.' + key);
    };

    setUser(value) {
        this.setInStorage(this.KEYS["USER"], value);
    };

    getUser() {
        this.getFromStorage(this.KEYS["USER"]);
    };

    removeUser() {
        this.removeFromStorage(this.KEYS["USER"]);
    };

    setApplication(value) {
        this.setInStorage(this.KEYS["APP"], value);
    };
    setConfig(value) {
        this.setInStorage(this.KEYS["JMMB_CONFIG"], value);
    }
    getConfig() {
        return this.getFromStorage(this.KEYS["JMMB_CONFIG"]);
    }
    removeConfig() {
        this.removeFromStorage(this.KEYS["JMMB_CONFIG"]);
    };
    getApplication() {
        this.getFromStorage(this.KEYS["APP"]);
    };

    getapplication(arn): Observable<any> {
        return this.http.get(environment.apiURL + "/api/applications/" + arn, this.httpOptions)
            .pipe(map(response => {
                return response;
            }
            ));
    }

    removeApplication() {
        this.removeFromStorage(this.KEYS["APP"]);
    };

    setApplicationConfig(value) {
        this.setInStorage(this.KEYS["GLOBAL_CONFIG"], value);
    };

    getApplicationConfig() {
        return this.getFromSessionStorage(this.KEYS["GLOBAL_CONFIG"]);
    };

    removeApplicationConfig() {
        this.removeFromStorage(this.KEYS["GLOBAL_CONFIG"]);
    };

    setLoanConfig(value) {
        this.setInStorage(this.KEYS["JMMB_LOAN"], value);
    };

    getLoanConfig() {
        return this.getFromStorage(this.KEYS["JMMB_LOAN"]);
    };

    removeLoanConfig() {
        this.removeFromStorage(this.KEYS["JMMB_LOAN"]);
    };

    setToken(value) {
        this.setInStorage(this.KEYS["TOKEN"], value);
    }

    setTokenGenerationTime(value) {
        this.setInStorage(this.KEYS["TOKEN_GENEARTION_TIME"], value);
    }

    getToken() {
        return this.getFromStorage(this.KEYS["TOKEN"]);
    }

    getTokeGenerationTime() {
        return this.getFromStorage(this.KEYS["TOKEN_GENEARTION_TIME"]);
    }

    removeToken() {
        this.removeFromStorage(this.KEYS["TOKEN"]);
    }

    removeLookupData() {
        sessionStorage.removeItem('lookupData');
    }

    removeAllConfigData() {
        this.removeInJourneyFromStorage();
        this.removeUser();
        this.removeConfig();
        this.removeApplication();
        this.removeApplicationConfig();
        this.removeLookupData();
    }

    //refresh token api call
    getApplicationConfigToken(): Observable<any> {
        let arn = this.getARNFromJourneyStorage();
        return this.http.post<any>(environment.apiURL + "/api/applications/" + arn + "/refreshToken", arn, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
            observe: 'response'
        }).pipe(map(response => {
            return response;
        }
        ));
    }

    saveData(data): Observable<any> {
        // return this.http.post<any>(environment.apiURL + "/api/applications/createApplication?context=" + context.context, data, this.httpOptions)
        return this.http.post<any>(environment.apiURL + "/api/applications/createApplication", data.appData, this.httpOptions)
            .pipe(map(response => {
                return response;
            }
            ));
    }

    savePreference(data) {

        let preferenceData = {
            "lastVisitedPage": data.context,
            "visitorIP": null
        }
        return this.http.post(environment.apiURL + "/api/applications/" + data.arn + "/" + "PREFERENCES/" + data.saveFlag, preferenceData, this.httpOptions)
            .pipe(map(response => {
                return response;
            }));
    }

    // savePreference(data) {
    //     let arn = this.getFromStorage("APP").arn;
    //     return this.http.post(environment.apiURL + "/api/applications/" + arn + "/PREFERENCES", data.contextObj, this.httpOptions)
    //         .pipe(map(response => {
    //             return response;
    //         }
    //         ));
    //     // return arn;
    // }

    isTouchDevice() {
        return 'ontouchstart' in window // works on most browsers
            ||
            navigator.maxTouchPoints; // works on IE10/11 and Surface
    };


    getApplicationData(arn): Observable<any> {
        try {
            return this.http.get<any>(environment.apiURL + "/api/applications/getApplication/" + arn)
                .pipe(map(response => {
                    return response;
                }));
        }
        catch (exception) {
            console.log(exception.message)
        }

    }

    navigateRoute(preferences) {
        let numbers;
        let fallingComponent = preferences.lastVisitedPage.split(",");
        if (fallingComponent[0].indexOf("COAPPLICANT") > -1) {
            numbers = fallingComponent[0].match(/\d+/g).map(Number);
            fallingComponent[0] = "COAPPLICANT";
        }
        switch (fallingComponent[0]) {
            case "PRIMARY":
                let lastTab = preferences.lastVisitedPage.split(",")[1];
                this._router.navigate(['/journey/applicant', { lastTab: lastTab }]);
                break;
            case "COAPPLICANT":
                let coapplicantlastTab = preferences.lastVisitedPage.split(",")[1];
                this._router.navigate(['/journey/coapplicant', { lastTab: coapplicantlastTab, index: numbers[0] }]);
                break;
            case "LOANINFORMATION":
                this._router.navigate(['/journey/loan']);
                break;
            case "FINANCE-INFO":
                this._router.navigate(['/journey/financial-info']);
                break;
            case "REVIEW":
                this._router.navigate(['/journey/review']);
                break;
            case "CONSENTS":
                this._router.navigate(['/journey/consents']);
                break;
            case "DOCUMENT":
                this._router.navigate(['/journey/documents']);
                break;
            default:
                this._router.navigate(['/journey/applicant']);
                break;
        }
    }


    getExposedRelationship() {
        const lookupData = this.getLookupFromStorage();
        if (lookupData) {
            return lookupData.COMMON_PEP_RELATIONSHIP;
        }
    }

    getApplications() {
        return this.http.get<any>(environment.apiURL + '/api/application/123456')
            .pipe(map(response => {
                return response;
            }));
    }

    getExposedPosition() {
        const lookupData = this.getLookupFromStorage();
        if (lookupData) {
            return lookupData.COMMON_POLITICALLY_EXPOSED_POSITION;
        }
    }
    getLookupFromStorage() {
        if (sessionStorage.getItem('lookupData')) {
            return JSON.parse(sessionStorage.getItem('lookupData'));
        } else {
            return {};
        }
    }

    getRLOSData(arn): Observable<any> {
        return this.http.get<any>(environment.apiURL + "/api/applications/" + arn)
            .pipe(map(response => {
                return response;
            }));
    }

    // ValidateApplication(data): Observable<any> {
    //     return this.http.post<any>(environment.apiURL + '/api/applications/validateApplication', data.application, {
    //         headers: new HttpHeaders({
    //             'Content-Type': 'application/json'
    //         }),
    //         observe: 'response'
    //     }).pipe(map(response => {
    //         return response;
    //     }
    //     ));
    // }


    ValidateApplication(data): Observable<any> {
        return this.http.post<any>(environment.apiURL + '/api/applications/validateApplication', data.application).pipe(map(response => {
            return response;
        }
        ));
    }

    getSecurityQuestions() {
        const lookupData = this.getLookupFromStorage();
        if (lookupData) {
            return lookupData.SECURITY_QUESTIONS;
        }
    }

    getHourList() {
        const lookupData = this.getLookupFromStorage();
        if (lookupData) {
            return lookupData.APPOINTMENT_HOURS;
        }
    }

    getMinuteList() {
        const lookupData = this.getLookupFromStorage();
        if (lookupData) {
            return lookupData.APPOINTMENT_MINUTES;
        }
    }

    public setStorageItem(change: StorageChange): void {
        window[change.storageArea].setItem(change.key, JSON.stringify(change.value));
        this.storageChange$.next(change);
    }

    getLabelFromCode(list, code) {
        try {
            if (code) {
                return list.find(item => {
                    return item.code === code;
                }).label;
            }
            return null;
        }
        catch (exception) {
            console.log(exception.message)
        }
    }

    validateOtp(data): Observable<any> {
        return this.http.post<any>(environment.apiURL + "/api/applications/verifyOTP", data, this.httpOptions)
            .pipe(map(response => {
                return response;
            }));
    }

    resendOtp(data): Observable<any> {
        return this.http.post<any>(environment.apiURL + "/api/applications/resendOTP", data, this.httpOptions)
            .pipe(map(response => {
                return response;
            }));
    }
}
