import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from "rxjs/operators";

import { JourneyService } from '../_root/journey.service';
import { EnumsService, PersistanceService } from '../../core/services';
// import { PersistanceService } from '../../../services/persistence.service';
import { DOMHelperService } from '../../shared';
import { environment } from '../../../../environments/environment';

@Injectable()
export class LoanDetailsService {
    constructor(private journeyService: JourneyService, private enumsService: EnumsService,
        private persistanceService: PersistanceService, private http: HttpClient, private _dom: DOMHelperService) { }


    getYesNoList() {
        try {
            return this.enumsService.getYesNoList();
        }
        catch (exception) {
            console.log(exception.message)
        }
    }

    getFinanceTypeList() {
        try {
            return this.enumsService.getFinanceTypeList();
        }
        catch (exception) {
            console.log(exception.message)
        }
    }

    getLoanPurposeList() {
        try {
            return this.enumsService.getLoanPurposeList();
        }
        catch (exception) {
            console.log(exception.message)
        }
    }

    getSecurityTypeList() {
        try {
            return this.enumsService.getSecurityTypeList();
        }
        catch (exception) {
            console.log(exception.message)
        }
    }

    getCollateralTypeList() {
        try {
            return this.journeyService.getCollateralTypeList();
        }
        catch (exception) {
            console.log(exception.message)
        }
    }

    getPayOffTypeList() {
        try {
            return this.enumsService.getPayOffTypeList();
        }
        catch (exception) {
            console.log(exception.message)
        }
    }

    getConditionTypeList() {
        try {
            return this.enumsService.getConditionTypeList();
        }
        catch (exception) {
            console.log(exception.message)
        }
    }

    getCountryList() {
        try {
            return this.journeyService.getCountryList();
        }
        catch (exception) {
            console.log(exception.message)
        }
    }
    getStateList() {
        try {
            return this.journeyService.getState();
        }
        catch (exception) {
            console.log(exception.message)
        }
    }

    getTypeOfAccountList() {
        try {
            return this.enumsService.getTypeOfAccountList();
        }
        catch (exception) {
            console.log(exception.message)
        }
    }

    getPurchaseTypeList() {
        try {
            return this.journeyService.getPurchaseTypeList();
        }
        catch (exception) {
            console.log(exception.message)
        }
    }

    getVehicleYearList() {
        try {
            return this.journeyService.getVehicleYearList();
        }
        catch (exception) {
            console.log(exception.message)
        }
    }

    getLoanAmountMinMax() {
        try {
            return this.journeyService.getLoanAmountMinMax();
        }
        catch (exception) {
            console.log(exception.message)
        }
    }
    getCollateralType() {
        try {
            return this.journeyService.getCollateralType();
        }
        catch (exception) {
            console.log(exception.message)
        }
    }

    getLoanTerm() {
        try {
            return this.journeyService.getLoanTerm();
        }
        catch (exception) {
            console.log(exception.message)
        }
    }

    getDetailsFromVin(vinNumber, equipmentType) {
        try {
            var vinData = { 'vin': vinNumber.value, 'neworUsed': equipmentType.value + 'Car' };
            let arn = this.journeyService.getFromStorage().arn;
            return this.http.post(environment.apiURL + "/api/externalservice/vehicles/NADA?arn=" + arn, vinData)
                .pipe(map(response => {
                    return response;
                }
                ));
        }
        catch (exception) {
            console.log(exception.message)
        }
    }


    getLoanDetails() {
        let dto = this.journeyService.getFromStorage().loanDetails;
        return dto;
    }
    getLoan() {
        try {
            let dto = this.journeyService.getFromStorage().loanName;
            let loanTypeList = this.journeyService.getLoanProductType();
            let loanType = loanTypeList.find(lt => lt.label === dto.product).label;
            // var loanType;
            //  loanType =this.journeyService.getLabelFromCode(loanTypeList, loanType);

            // dto = { ...dto, ...{ loanType: loanType } };
            // return dto;
            return loanType;
        }
        catch (exception) {
            console.log(exception.message)
        }
    }

    getapplicant() {
        try {
            let applicanttDetails = [];
            for (var i = 0; i < this.journeyService.getFromStorage().applicants.length; i++) {
                let fname = this.journeyService.getFromStorage().applicants[i].firstName;
                let lname = this.journeyService.getFromStorage().applicants[i].lastName;
                let order = this.journeyService.getFromStorage().applicants[i].order;
                let fullname = (fname + " " + lname + " [" + order + "]");
                let applicantList = {
                    "label": fullname,
                    "code": order
                }
                applicanttDetails.push(applicantList);

            }
            return applicanttDetails;
        }
        catch (exception) {
            console.log(exception.message)
        }
    }

    getPrimaryApplicantList() {
        try {
            let appData = this.journeyService.getFromStorage();
            let primaryApplicant = appData.applicants.filter(applicant => applicant.type === 'PRIMARY');
            let applicanttDetails = [];
            for (var i = 0; i < primaryApplicant.length; i++) {
                let fname = primaryApplicant[i].firstName;
                let lname = primaryApplicant[i].lastName;
                let order = primaryApplicant[i].order;
                let fullname = (fname + " " + lname + " [" + order + "]");
                let applicantList = {
                    "label": fullname,
                    "code": order
                }
                applicanttDetails.push(applicantList);

            }
            return applicanttDetails;
        }
        catch (exception) {
            console.log(exception.message)
        }
    }


    modelToDto(model) {
        try {
            if (model.loanDetails) {
                let loanDetails: any = {};
                loanDetails = {
                    id: model.loanDetails.id ? model.loanDetails.id : null,
                    //  RICHA : BUG FIX : MEMBERID NOT AVAILABLE IN LOAN APPLICATIONS
                    order: model.loanDetails.primaryOwner ? this.journeyService.getCodeFromLabel(this.getapplicant(), model.loanDetails.primaryOwner) : null,
                    product: model.loanDetails.product ? model.loanDetails.product : null,
                    loanType: model.loanDetails.loanType ? model.loanDetails.loanType : null,
                    hasCollateral: model.loanDetails.hasCollateral ? model.loanDetails.hasCollateral : null,
                    loanPurposeType: model.loanDetails.loanPurposeType ? model.loanDetails.loanPurposeType : null,
                    amountRequired: model.loanDetails.amountRequired ? model.loanDetails.amountRequired : null,
                    collateralType: model.loanDetails.collateralType ? model.loanDetails.collateralType : null,
                    collateralName: model.loanDetails.collateralType ? this.journeyService.getLabelFromCode(this.getCollateralTypeList(), model.loanDetails.collateralType) + ` [1]` : null,
                    otherCollateral: model.loanDetails.otherCollateral ? model.loanDetails.otherCollateral : null,
                    collateralValue: model.loanDetails.collateralValue ? model.loanDetails.collateralValue : null,
                    presentCollateralValue: model.loanDetails.presentCollateralValue ? model.loanDetails.presentCollateralValue : null,
                    currency: model.loanDetails.currency ? model.loanDetails.currency : null,
                    primaryOwner: model.loanDetails.primaryOwner ? model.loanDetails.primaryOwner : null,
                    loanTerm: model.loanDetails.loanTerm ? model.loanDetails.loanTerm : null,
                    loanPurposeOthers: model.loanDetails.loanPurposeOthers ? model.loanDetails.loanPurposeOthers : null,
                    collateralInsertionId: model.loanDetails.collateralInsertionId ? (model.loanDetails.hasCollateral === 'Yes' ? model.loanDetails.collateralInsertionId : (model.loanDetails.collateralInsertionId * -1)) : null,
                    creditCardDetails: [],
                    overdraftDetails: []
                }

                if (model.loanDetails.creditCardDetails && model.loanDetails.creditCardDetails.length > 0) {
                    model.loanDetails.creditCardDetails = model.loanDetails.creditCardDetails.map((card, index) => {
                        return {
                            'order': card.cardsRequiredFor ? index + 1 : null,
                            'applicantOrder': card.cardsRequiredFor ? this.journeyService.getCodeFromLabel(this.getapplicant(), card.cardsRequiredFor) : null,
                            'cardsRequiredFor': card.cardsRequiredFor ? card.cardsRequiredFor : null,
                            'cardType': card.cardType ? card.cardType : null,
                            'cardTypeLabel': card.cardType ? this.journeyService.getLabelFromCode(this.journeyService.getCardType(), card.cardType) : null,
                            'branch': card.branch ? card.branch : null,
                            'branchLabel': card.branch ? this.journeyService.getLabelFromCode(this.journeyService.getBranchList(), card.branch) : null,
                            'id': card.id ? card.id : null
                        }
                    });
                    loanDetails.creditCardDetails = model.loanDetails.creditCardDetails;
                }

                if (model.loanDetails.overdraftDetails && model.loanDetails.overdraftDetails.length > 0) {
                    model.loanDetails.overdraftDetails = model.loanDetails.overdraftDetails.map((overdraft, index) => {
                        return {
                            'order': overdraft.overdraftRequiredFor ? index + 1 : null,
                            'applicantOrder': overdraft.overdraftRequiredFor ? this.journeyService.getCodeFromLabel(this.getapplicant(), overdraft.overdraftRequiredFor) : null,
                            'overdraftRequiredFor': overdraft.overdraftRequiredFor ? overdraft.overdraftRequiredFor : null,
                            'overdraftPurpose': overdraft.overdraftPurpose ? overdraft.overdraftPurpose : null,
                            'overdraftName': overdraft.overdraftPurpose ? this.journeyService.getLabelFromCode(this.journeyService.getLoanPurposeList(), overdraft.overdraftPurpose) + ' [' + (index + 1) + ']' : null,
                            'otherOverdraftPurpose': overdraft.otherOverdraftPurpose ? overdraft.otherOverdraftPurpose : null,
                            'overdraftPurposeLabel': overdraft.overdraftPurpose ? this.journeyService.getLabelFromCode(this.journeyService.getLoanPurposeList(), overdraft.overdraftPurpose) : null,
                            'id': overdraft.id ? overdraft.id : null
                        }
                    });
                    loanDetails.overdraftDetails = model.loanDetails.overdraftDetails;
                }

                return loanDetails;
                // applicant.addressDetails = addressDetails;
            }

            // applicant.order = 1;



        } catch (exception) {
            console.log(exception.message);
        }
    }


    // modelToDTO(loanDetails, collateralTypeDetails, collateralObject?) {
    //     try {
    //         if (collateralObject) {
    //             loanDetails = { ...loanDetails, ...collateralObject };
    //         }
    //         if (loanDetails.collateralTypeDetails) {
    //             loanDetails.collateralTypeDetails = Object.assign(loanDetails.collateralTypeDetails, collateralTypeDetails);
    //         }
    //         else {
    //             loanDetails = Object.assign({ collateralTypeDetails: {} }, loanDetails);
    //             loanDetails.collateralTypeDetails = Object.assign(loanDetails.collateralTypeDetails, collateralTypeDetails);
    //         }
    //         if (loanDetails.collateralTypeDetails) {

    //             if (collateralTypeDetails && collateralTypeDetails.payOffDetails && collateralTypeDetails.payOffDetails.hasPayOff) {
    //                 loanDetails.collateralTypeDetails.hasPayOff = collateralTypeDetails.payOffDetails.hasPayOff;
    //                 loanDetails.collateralTypeDetails.payOffs = collateralTypeDetails.payOffDetails.payOffs;
    //                 delete loanDetails.collateralTypeDetails.payOffDetails;
    //             }
    //             else {
    //                 loanDetails.collateralTypeDetails = Object.assign({}, collateralTypeDetails);
    //             }
    //             loanDetails.collateralTypeDetails.loanProduct = loanDetails.loanProduct;
    //         }

    //         return loanDetails;
    //     }
    //     catch (exception) {
    //         console.log(exception.message)
    //     }
    // }

    saveDataInStorage(colateralDetailsDTO) {
        try {
            let appData = this.persistanceService.getFromJourneyStorage();
            appData = Object.assign(appData, { loanDetails: colateralDetailsDTO });

            // appData = Object.assign({}, appData, { collateralDetails: colateralDetailsDTO });

            if (colateralDetailsDTO.collateralTypeDetails && colateralDetailsDTO.collateralTypeDetails.hasPayOff) {
                appData.loanDetails.collateralTypeDetails.hasPayOff = colateralDetailsDTO.collateralTypeDetails.hasPayOff;
                appData.loanDetails.collateralTypeDetails.payOffs = colateralDetailsDTO.collateralTypeDetails.payOffs;
            }
            else {
                appData = Object.assign(appData, { loanDetails: colateralDetailsDTO });
            }

            this.persistanceService.setInJourneyStorage(appData);
        }
        catch (exception) {
            console.log(exception.message)
        }
    }

    saveData(data) {
        this.persistanceService.setInJourneyStorage(data);
    }



    saveLoanDetailsData(data): Observable<any> {
        return this.http.post(environment.apiURL + '/api/applications/' + data.arn + '/collateral', data.appData)
            .pipe(map(response => {
                this.savePreference({
                    arn: data.arn,
                    lastVisitedPage: data.context,
                    visitorIP: null,
                    saveFlag: data.saveFlag
                }).subscribe(response => {

                });
                return response;
            }));
    }


    savePreference(data) {
        let preferenceData = {
            "lastVisitedPage": data.lastVisitedPage,
            "visitorIP": null
        }
        return this.http.post(environment.apiURL + "/api/applications/" + data.arn + "/" + "PREFERENCES/" + data.saveFlag, preferenceData)
            .pipe(map(response => {
                return response;
            }));
    }

}
