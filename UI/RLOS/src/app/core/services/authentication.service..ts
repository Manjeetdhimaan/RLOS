import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { catchError, finalize, map, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

declare var require: any;

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
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

    validateApplication(data): Observable<any> {
        return this.http.post<any>(environment.apiURL + "/api/ibps/applications/VALIDATE?arn=" + data.arn + "&ssn=" + data.ssn + "&dob=" + data.dateOfBirth, data, this.httpOptions)
            .pipe(map(response => {
                return response;
            }
            ));
    }
}
