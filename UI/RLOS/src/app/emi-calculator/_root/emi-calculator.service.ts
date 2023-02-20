import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from "rxjs/operators";
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';

@Injectable()
export class EmiCalculatorService {
    constructor(private http: HttpClient) { }

    getEMICalcData() {
        return this.http.get<any>(environment.apiURL + "/api/master/en/EMICALC")
            .pipe(map(response => {
                return response;
            }));
    }
    
}
