import { Injectable } from '@angular/core';
import { Observable, Subject, empty } from 'rxjs';
import { JourneyService } from '../_root/journey.service';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { map } from "rxjs/operators";
import { DOMHelperService } from '../../shared';



@Injectable()
export class FinancialInfoService {
    alertObj: {};
    constructor(private journeyService: JourneyService, private http: HttpClient, private _dom: DOMHelperService) { }

    dtoToModel(type, tempAppData?) {
        let assetList = this.getAssetType();
        let applicantList = [];
        var applicantObj = tempAppData ? tempAppData : this.journeyService.getFromStorage();
        if (applicantObj && applicantObj.applicants) {
            var applicant = applicantObj.applicants.filter(x => x.type == type);
            if (applicant.length > 0) {
                applicant.forEach(element => {
                    if (element.financialDetails && element.financialDetails.assetDetails) {
                        let financialDetails: any = {};
                        financialDetails.id = element.financialDetails.id ? element.financialDetails.id : null;
                        financialDetails.incomeDetails = element.financialDetails.incomeDetails ? element.financialDetails.incomeDetails : null;
                        financialDetails.assetDetails = [];
                        financialDetails.assetDetails = element.financialDetails.assetDetails.map((assetDetail) => {
                            return {
                                'id': assetDetail.id ? assetDetail.id : null,
                                'type': assetDetail.type ? assetDetail.type : null,
                                'amount': assetDetail.amount ? assetDetail.amount : null,
                                'instName': assetDetail.instName ? assetDetail.instName : null,
                                'comment': assetDetail.comment ? assetDetail.comment : null,
                                'assetLabel': assetDetail.type ? assetDetail.type : null,
                                'assetCode': assetDetail.type ? assetList.find(ast => ast.label === assetDetail.type).code : null
                            }
                        });

                        element.financialDetails = financialDetails;
                       
                    } else {
                        let financialDetails: any = {};

                        financialDetails.id = element.financialDetails.id ? element.financialDetails.id : null;
                        financialDetails.incomeDetails = element.financialDetails.incomeDetails ? element.financialDetails.incomeDetails : null;
                        financialDetails.assetDetails = [];

                        financialDetails.assetDetails = assetList.map(asl => {
                            return {
                                type: asl.code ? asl.code : null,
                                amount: null,
                                instName: null,
                                comment: null,
                                assetLabel: asl.label ? asl.label : null,
                                applicationId: element.id
                            }
                        })
                        // let assetDetails = [];

                        // assetList.forEach(asl => {
                        //     var assetObj = {
                        //         type: asl.code ? asl.code : null,
                        //         amount: null,
                        //         instName: null,
                        //         comment: null,
                        //         assetLabel: asl.label ? asl.label : null,
                        //         applicationId: element.id
                        //     }
                        //     assetDetails.push(assetObj);
                        // });
                        // element.assetDetails = assetDetails;
                        element.financialDetails = financialDetails;
                    }
                    applicantList.push(element);
                });
            }

        }
        return applicantList;
    }


    getFilledAssetDetails(tempAppData) {
        let assetList = this.getAssetType();
        let applicantList = [];
        if (tempAppData && tempAppData.applicants) {
            var applicant = tempAppData.applicants;
            if (applicant.length > 0) {
                applicant.forEach(element => {
                    if (element.financialDetails) {
                        let financialDetails: any = {};
                        financialDetails.id = element.assetDetails.id ? element.assetDetails.id : null;
                        financialDetails.assetDetails = [];
                        financialDetails.assetDetails = element.financialDetails.assetDetails.map((assetDetail) => {
                            return {
                                'type': assetDetail.type ? assetDetail.type : null,
                                'amount': assetDetail.amount ? assetDetail.amount : null,
                                'instName': assetDetail.instName ? assetDetail.instName : null,
                                'comment': assetDetail.comment ? assetDetail.comment : null,
                                'assetLabel': assetDetail.type ? assetDetail.type : null
                                // 'assetLabel': assetList.find(ast => ast.code === assetDetail.type).label
                            }
                        });

                        element.financialDetails = financialDetails;

                        // element.assetDetails = element.assetDetails.map((assetDetail, index) => {
                        //     return {
                        //         'type': assetDetail.type ? assetDetail.type : null,
                        //         'amount': assetDetail.amount ? assetDetail.amount : null,
                        //         'instName': assetDetail.instName ? assetDetail.instName : null,
                        //         'comment': assetDetail.comment ? assetDetail.comment : null,
                        //         'assetLabel': assetList.find(ast => ast.code === assetDetail.type).label
                        //     }
                        // });
                    } else {
                        let assetDetails = [];
                        assetList.forEach(asl => {
                            var assetObj = {
                                type: asl.code ? asl.code : null,
                                amount: null,
                                instName: null,
                                comment: null,
                                assetLabel: asl.label ? asl.label : null,
                                applicationId: element.id
                            }
                            assetDetails.push(assetObj);
                        });
                        element.assetDetails = assetDetails;
                    }
                    applicantList.push(element);
                });
            }

        }
        return applicantList;
    }

    modelToDTO(model, appData) {
        if (model) {
            let financialDetails: any = {};
            financialDetails.id = model.id ? model.id : null;
            financialDetails.incomeDetails = appData.applicants[model.assetDetails[0].applicantOrder - 1].financialDetails.incomeDetails ? appData.applicants[model.assetDetails[0].applicantOrder - 1].financialDetails.incomeDetails : null;
            financialDetails.assetDetails = [];
            let assetList = this.getAssetType();
            financialDetails.assetDetails = model.assetDetails.map((asset) => {
                return {
                    'id': asset.id ? asset.id : null,
                    'type': asset.assetLabel ? asset.assetLabel : null,
                    // 'type': asset.type ? asset.type : null,
                    'amount': asset.amount ? asset.amount : null,
                    'comment': asset.comment ? asset.comment : null,
                    'applicantOrder': asset.applicantOrder ? asset.applicantOrder : null,
                    'instName': asset.instName ? asset.instName : null,
                    'assetCode': asset.assetLabel ? assetList.find(ast => ast.label === asset.assetLabel).code : null
                }
            });

            appData.applicants[model.assetDetails[0].applicantOrder - 1].financialDetails = financialDetails;



            // appData.applicants[model.assetDetails[0].applicantOrder - 1].assetDetails = model.assetDetails.map((asset) => {
            //     return {
            //         'type': asset.type ? asset.type : null,
            //         'amount': asset.amount ? asset.amount : null,
            //         'comment': asset.comment ? asset.comment : null,
            //         'instName': asset.instName ? asset.instName : null
            //     }
            // });
        }
        return appData;
    };

    saveAndExit(data) {
        return this.journeyService.saveAndExitApplication(data);
    }

    getByteData(str) {
        if (str) {
            return str.substr(str.indexOf(',') + 1);
        }
        else {
            return null;
        }
    }

    getPrimaryApplicantModel() {
        let appData = this.journeyService.getFromStorage();
        return appData.applicants.filter(x => x.type == "PRIMARY")[0];
    }

    getCoApplicantModel() {
        let appData = this.journeyService.getFromStorage();
        return appData.applicants.filter(x => x.type == "CO_APPLICANT");
    }

    saveProductType(data) {
        var appData = this.journeyService.getFromStorage();
        if (!appData.collateralDetail.productType) {
            if (data.productType) {
                appData.collateralDetail = Object.assign({}, appData.collateralDetail, data);
            }
            this.journeyService.setInStorage(appData);
        }
    }

    getAssetType() {
        return this.journeyService.getAssetType();
    }

    getApplicantValidationValues() {
        return this.journeyService.getValidationValues().application.applicant;
    }

    isAssetsMandatory() {
        let appData = this.journeyService.getFromStorage();
        let collateralType = appData.collateralDetails.collateralType;
        let loanAmount = appData.collateralDetails.loanAmount;
        let typeOfLoan = appData.collateralDetails.typeOfLoan;
        let financialThreshold = this.journeyService.getFinancialThreshold(collateralType);
        if (loanAmount > financialThreshold) {
            return true;
        }
        else {
            return false;
        }
    }

    isOtherProductType(collateralType) {
        if (collateralType === '026' || collateralType === '030' || collateralType === '015' || collateralType === '028' || collateralType === '049' || collateralType === '036' || collateralType === '000' || collateralType === '037' || collateralType === '054' || collateralType === '004' || collateralType === '031' || collateralType === '034' || collateralType === '027' || collateralType === '025' || collateralType === '006' || collateralType === '012' || collateralType === '005' || collateralType === '032' || collateralType === '038' || collateralType === '047' || collateralType === '048' || collateralType === '003') {
            return true;
        }
        return false;
    }

    isVLProductType(collateralType) {
        if (collateralType === '026' || collateralType === '030' || collateralType === '005' || collateralType === '032' || collateralType === '038' || collateralType === '047' || collateralType === '048' || collateralType === '003') {
            return true;
        }
        return false;
    }

    
    //Added by Hemlata for Liability Type dropdown on 17 Oct 2022
    getLiabilityTypeList() {
        return this.journeyService.getLiabilityTypeList();
    }

}
