import { Injectable } from '@angular/core';
import { isDevMode } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, finalize, map, tap } from 'rxjs/operators';

declare var require: any;
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  httpOptions;
  applicationURL;
  applicantURL;
  api_url = require("../../../../resources/api_endPoints.json");
  constructor(private http: HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    this.applicantURL = isDevMode() ? this.api_url.local.applicant : this.api_url.prod.applicant;
    this.applicationURL = isDevMode() ? this.api_url.local.application : this.api_url.prod.application;

  }

  hero = {
    "dateOfBirth": "10-12-1994",
    "email": "a@a.com",
    "firstName": "string",
    "lastName": "string",
    "middleName": "string",
    "mobileNumber": "9599822877",
    "productName": "string",
    "ssn": "AXTOA9857PM"
  }

  saveData(data): Observable<any> {
    return this.http.post<any>(this.applicationURL, data, this.httpOptions)
      .pipe(map(response => {
        return response;
      }
      ));
  }
}
