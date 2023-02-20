import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from "rxjs/operators";

import { environment } from '../../../../environments/environment';
import { JourneyService } from '../_root/journey.service';
import { PersistanceService } from '../../core/services';

@Injectable()
export class ConsentsService {
    constructor(private journeyService: JourneyService, private persistanceService: PersistanceService,
        private http: HttpClient) { }

    dtoToModel() {
        var consentsData: any = [];
        let applicantObj = this.journeyService.getFromStorage();
        var applicants = applicantObj.applicants;
        if (applicantObj && applicants) {
            for (let applicant of applicants) {
                if (applicant.consents) {
                    consentsData.push({
                        privacyConsent: applicant.consents.privacyConsent ? applicant.consents.privacyConsent : false,
                        firstName: applicant.firstName,
                        lastName: applicant.lastName
                    });
                } else {
                    consentsData.push({
                        privacyConsent: false,
                        firstName: applicant.firstName,
                        lastName: applicant.lastName
                    });
                }
            }
        };
        return consentsData;
    }

    getBankingCenter() {
        let applicantObj = this.journeyService.getFromStorage();
        return applicantObj.branchCode;
    }

    modelToDTO(consentsData, consentFormValues) {
        let applicantObj = this.journeyService.getFromStorage();
        applicantObj.branchCode = consentFormValues.branchCode;
        var applicants = applicantObj.applicants;
        if (applicantObj && applicants) {
            for (let i = 0; i < applicants.length; i++) {
                if (applicants[i].consents) {
                    applicants[i].consents.privacyConsent = consentsData[i].privacyConsent;
                } else {
                    applicants[i].consents = {
                        privacyConsent: consentsData[i].privacyConsent
                    };
                }
            }
        }
        return Object.assign({}, applicantObj);
    }
}
