import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { catchError, finalize, map, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

declare var require: any;

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
    httpOptions: any;
    constructor(private http: HttpClient) {

        let httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        this.httpOptions = {
            headers: httpHeaders,
            observe: 'response'
        };
    }

    loadApplicationMasterData(): Observable<any> {
        return this.http.post<any>(environment.apiURL + "/api/master/mdm", this.httpOptions)
            .pipe(map(response => {
                return response;
            }
            ));
    }

    getApplicationConfigData(): Observable<any> {
        let httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        this.httpOptions = {
            headers: httpHeaders,
        };
        return this.http.get<any>(environment.apiURL + "/api/master/config", this.httpOptions)
            .pipe(map(response => {
                return response;
            }
            ));
    }

    loadApplicationEnvConfig(): Observable<any> {

        let baseUrl = window.location.href.split('#')[0];
        baseUrl = (baseUrl[baseUrl.length - 1] === '/') ? baseUrl.substring(0, baseUrl.length - 1) : baseUrl;

        return this.http.post<any>(baseUrl + "/enviornments/runtime-env-overrides.json", this.httpOptions)
            .pipe(map(response => {
                return response;
            }
            ));
    }    
}
