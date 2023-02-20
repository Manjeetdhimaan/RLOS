import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { catchError, finalize, map, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

declare var require: any;
@Injectable()
export class PersistanceService {

    private CACHE_PREFIX: string = 'JMMB';

    private KEYS: Object = {
        USER: 'USER',
        APP: 'APP',
        TOKEN: 'TOKEN',
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

    getFromJourneyStorage() {
        if (sessionStorage.getItem('JMMB.APP')) {
            return JSON.parse(sessionStorage.getItem('JMMB.APP'));
        } else {
            return null;
        }
    }
    getConfigFromJourneyStorage() {
        if (sessionStorage.getItem('ANBTX.JMMB_CONFIG')) {
            return JSON.parse(sessionStorage.getItem('ANBTX.JMMB_CONFIG'));
        } else {
            return null;
        }
    }

    getARNFromJourneyStorage() {
        if (sessionStorage.getItem('ANBTX.ARN')) {
            return JSON.parse(sessionStorage.getItem('ANBTX.ARN'));
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

    getLookupData() {
        return this.http.get<any>(environment.apiURL + "/api/master/en/JOURNEY/")
            .pipe(map(response => {
                return response;
            }));
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
        sessionStorage.setItem('ANBTX.ARN', JSON.stringify(data));
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
    removeApplication() {
        this.removeFromStorage(this.KEYS["APP"]);
    };

    setApplicationConfig(value) {
        this.setInStorage(this.KEYS["GLOBAL_CONFIG"], value);
    };

    getApplicationConfig() {
        return this.getFromStorage(this.KEYS["GLOBAL_CONFIG"]);
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

    getToken() {
        return this.getFromStorage(this.KEYS["TOKEN"]);
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

    getApplications() {
        return this.http.get<any>(environment.apiURL + '/api/application/123456')
            .pipe(map(response => {
                return response;
            }));
    }
    getApplicationConfigToken(): Observable<any> {
        let appData = this.getFromJourneyStorage();
        return this.http.post<any>(environment.apiURL + "/api/applications/token/REFRESH", appData.arn, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
            observe: 'response'
        })
            .pipe(map(response => {
                return response;
            }
            ));
    }

    saveData(data): Observable<any> {
        return this.http.post<any>(environment.apiURL + "/api/applications/", data, this.httpOptions)
            .pipe(map(response => {
                return response;
            }
            ));
    }

    savePreference(data) {
        let arn = this.getFromStorage("APP").arn;
        return this.http.post(environment.apiURL + "/api/applications/" + arn + "/PREFERENCES", data.contextObj, this.httpOptions)
            .pipe(map(response => {
                return response;
            }
            ));
        // return arn;
    }

    isTouchDevice() {
        return 'ontouchstart' in window // works on most browsers
            ||
            navigator.maxTouchPoints; // works on IE10/11 and Surface
    };

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
                this._router.navigate(['/journey/coapplicant']);
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
            default:
                this._router.navigate(['/auth/dashboard']);
                break;

        }
    }
    getExposedRelationship() {
        const lookupData = this.getLookupFromStorage();
        if (lookupData) {
            return lookupData.COMMON_POLITICALLY_EXPOSED_RELATIONSHIP;
        }
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


    getQuestionList() {
        let lookupData = this.getLookupFromStorage();
        if (lookupData) {
            return lookupData.SECURITY_QUESTIONS;
        }
    }

    getLabelFromCode(list, code) {
        return list.find(item => {
            return item.code === code;
        }).label;

    }
}
