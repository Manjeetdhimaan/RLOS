import { Injectable, isDevMode } from '@angular/core';
// import { isDevMode } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, throwError, of } from 'rxjs';
import { catchError, finalize, map, tap } from 'rxjs/operators';
import { ApiService } from '../../core/services';
import { environment } from '../../../../environments/environment';
import { DOMHelperService } from '../../shared';
import { Router } from '@angular/router';
var mdmData = require('../../../resources/mocks/mdm.json');


declare var require: any;
var jsonpatch = require('fast-json-patch');

@Injectable()
export class JourneyService {
    private subject = new Subject<any>();
    httpOptions;
    applicationURL;
    applicantURL;
    idScanURL;
    response: any = [];
    country_Master: any;
    country_MasterModified: any = [];
    obj: any = [];

    steps = ['Applicant Information', 'Co-Applicant Information', 'Loan & Collateral Information', 'Review', 'Consents', 'Complete'];
    public static stepObject = [{ step: '/journey/home', isValid: false }, { step: '/journey/applicant', isValid: false },
    { step: '/journey/coapplicant', isValid: false }, { step: '/journey/loan', isValid: false },
    { step: '/journey/financial-info', isValid: false }, { step: '/journey/review', isValid: false }, { step: '/journey/consents', isValid: false }, { step: '/journey/complete', isValid: false }];
    currentStep;
    backFlag = false;
    constructor(private apiService: ApiService, private http: HttpClient, private _dom: DOMHelperService, private router: Router) {
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
    }

    setStepper(activeStep: number) {
        this.subject.next({ activeStep: activeStep });
    }

    getStep() {
        let step = {
            activeStep: 0
        }
        switch (this.router.routerState.snapshot.url) {
            case '/journey/home':
                step.activeStep = 0;
                break;
            case '/journey/applicant':
                step.activeStep = 1;
                break;
            case '/journey/coapplicant':
                step.activeStep = 2;
                break;
            case '/journey/loan':
                step.activeStep = 3;
                break;
            case '/journey/financial-info':
                step.activeStep = 4;
                break;
            case '/journey/review':
                step.activeStep = 5;
                break;
            case '/journey/consents':
                step.activeStep = 6;
                break;
            case '/journey/documents':
                step.activeStep = 7;
                break;
            case '/journey/complete':
                step.activeStep = 8;
                break;
        }
        return step;
    }

    getArn() {
        let application = this.getFromStorage();
        return application.arn;
    };

    getPrimaryApplicant() {
        let application = this.getFromStorage();
        if (application.applicants) {
            let applicant = application.applicants.find((item) => {
                return item.type === 'PRIMARY'
            });
            return applicant;
        } else {
            return null;
        }

    };

    getFromStorage() {
        if (sessionStorage.getItem('JMMB.APP')) {
            return JSON.parse(sessionStorage.getItem('JMMB.APP'));
        } else {
            return {};
        }
    }

    setInStorage(data) {
        try {
            var appData = this.getFromStorage();
            appData = Object.assign({}, appData, data);
            sessionStorage.setItem('JMMB.APP', JSON.stringify(appData));
        }
        catch (exception) {
            console.log(exception.message)
        }
    }

    getAccountRelationshipInDto() {
        try {
            let appData = this.getFromStorage();
            appData.preferences.lastVisitedPage = "DOCUMENT";
            if (appData && appData.applicants) {

                //if no coapplicant
                if (appData.applicants.length === 1) {
                    appData.applicants[0]['loanRelationship'] = this.getLabelFromCode(this.getrelationship(), 'NG_SOW');
                    appData.applicants[0]['loanRelationshipCode'] = 'NG_SOW';
                } else {
                    let primaryApplicant = appData.applicants.filter((element) => element.type === 'PRIMARY')[0];
                    const index = appData.applicants.findIndex(x => x.type === 'PRIMARY');

                    //Primary applicant account 
                    primaryApplicant['loanRelationship'] = this.getLabelFromCode(this.getrelationship(), 'NG_JOF');
                    primaryApplicant['loanRelationshipCode'] = 'NG_JOF';

                    appData.applicants[index] = { ...appData.applicants[index], ...primaryApplicant };


                    //Co Applicant Account Relationship                     
                    if (appData.applicants.filter((element) => element.type !== 'PRIMARY').length > 0) {
                        appData.applicants.filter((element) => element.type !== 'PRIMARY').forEach((element, index) => {
                            //for first coapplicant
                            if (index === 0) {
                                element['loanRelationship'] = this.getLabelFromCode(this.getrelationship(), 'NG_JAO');
                                element['loanRelationshipCode'] = 'NG_JAO';
                            }

                            //for rest of the coapplicants 
                            else {
                                element['loanRelationship'] = this.getLabelFromCode(this.getrelationship(), 'NG_JA' + index);
                                element['loanRelationshipCode'] = 'NG_JA' + index;
                            }
                        });
                    }
                }

                return appData;
            }
        } catch (exception) {
            console.log(exception.message)
        }
    }

    removeFromStorage() {
        sessionStorage.removeItem('JMMB.APP');
    }

    getARNFromStorage() {
        if (sessionStorage.getItem('JMMB.ARN')) {
            return JSON.parse(sessionStorage.getItem('JMMB.ARN'));
        } else {
            return {};
        }
    }

    setARNInStorage(data) {
        sessionStorage.setItem('JMMB.ARN', JSON.stringify(data));
    };

    removeARNFromStorage() {
        sessionStorage.removeItem('JMMB.ARN');
    }

    getLookupFromStorage() {
        try {
            if (sessionStorage.getItem('lookupData')) {
                return JSON.parse(sessionStorage.getItem('lookupData'));
            } else {
                return {};
            }
        } catch (exception) {
            console.log(exception.message);
        }
    }

    getPurchaseTypeList() {
        try {
            let lookupData = this.getLookupFromStorage();
            if (lookupData) {
                return lookupData.COMMON_Vehicle_Purch;
            } else {
                return mdmData.COMMON_Vehicle_Purch;
            }
        } catch (exception) {
            console.log(exception.message);
        }
    }

    getDisclosureDetails() {
        try {
            const lookupData = this.getLookupFromStorage();
            if (lookupData) {
                return lookupData.CONSENT_MESSAGE;
            }
        }
        catch (exception) {
            console.log(exception.message)
        }
    }

    getVehicleYearList() {

        let lookupData = this.getLookupFromStorage();
        if (environment.isMockingEnabled) {
            return mdmData.COMMON_Vehicle_Year;
        }
        else {
            return lookupData.COMMON_Vehicle_Year;
        }

    }

    getCountryList() {
        let lookupData = this.getLookupFromStorage();
        if (environment.isMockingEnabled) {
            return mdmData.ADDRESS_County;
        }
        return lookupData.ADDRESS_County;
    }
    getLoanAmountMinMax() {
        let lookupData = this.getLookupFromStorage();
        if (environment.isMockingEnabled) {
            return mdmData.COMMON_Collateral_Type_Min_Max_Laon_Amount;
        }
        return lookupData.COMMON_Collateral_Type_Min_Max_Laon_Amount;
    }

    //To add in mdm.json(Kushal)
    getCollateralType() {
        let lookupData = this.getLookupFromStorage();

        if (lookupData) {
            return lookupData.COMMON_Collateral_Type;
        } else {
            return mdmData.COMMON_Collateral_Type;
        }

    }



    setLookupInStorage(data) {
        var lookupData = this.getLookupFromStorage();
        lookupData = Object.assign({}, lookupData, data);
        sessionStorage.setItem('lookupData', JSON.stringify(lookupData));
    };

    removeLookupFromStorage() {
        sessionStorage.removeItem('lookupData');
    }



    getLoanType() {
        let lookupData = this.getLookupFromStorage();
        if (environment.isMockingEnabled) {
            return mdmData.COMMON_Loan_Type;
        }
        else {
            return lookupData.COMMON_Loan_Type;
        }
    }

    getLabelFromCode(list, code) {
        return list.find(item => {
            return item.code === code;
        }).label;
    }

    //card type from list
    getCardTypeFromCode(list, code) {
        return list.find(item => {
            return item.code === code;
        }).type;
    }

    getCodeFromLabel(list, label) {
        return list.find(item => {
            return item.label === label;
        }).code;
    }

    getMinLoanAmountValue(list, code) {
        return +(list.find(item => {
            return item.code === code;
        }).minLoanAmount);
    }
    getMaxLoanAmountValue(list, code) {
        return +(list.find(item => {
            return item.code === code;
        }).maxLoanAmount);
    }

    getStateCode(state) {
        let lookupData = this.getLookupFromStorage();
        if (lookupData) {
            lookupData.COMMON_STATE.forEach(list => {
                if (list.label === state) {
                    return list.code;
                }
            })
        }
    }

    getCollateralListByLoanType(loanType) {
        let lookupData = this.getLookupFromStorage();
        if (lookupData) {
            let collateralObj = [];

            if (loanType === "TL") {
                lookupData.COMMON_Collateral_Type = lookupData.COMMON_Collateral_Type.filter(item => {
                    return item.code !== "046_2";
                });
            }
            else {
                lookupData.COMMON_Collateral_Type = lookupData.COMMON_Collateral_Type.filter(item => {
                    return item.code === "046_2";
                });
            }

            // var result = lookupData.COMMON_Collateral_Type.filter(function (o1) {
            //     // filter out (!) items in result2
            //     return collateralObj.some(function (o2) {
            //         return o1.code === o2.collateralTypeCode;          // assumes unique id
            //     });
            // })

            return lookupData.COMMON_Collateral_Type;
        }
        else {
            return require('../../../resources/mocks/Others.json');
        }
    }

    getSecurityTypeList() {
        // let lookupData = this.getLookupFromStorage();
        // if (lookupData) {

        //     if (lookupData) {
        //         return lookupData.COMMON_Loan_Type;
        //     }

        // }
        // // else {
        return require('../../../resources/mocks/loanSecurityType.json');
        // }
    }  //subhasree to ger loan purpose
    // getLoanPurposeList(productType) {
    //     let lookupData = this.getLookupFromStorage();
    //     if (lookupData) {
    //         let loanPurposeObj = [];
    //         lookupData.COMMON_Loan_Purpose.forEach(list => {
    //             if (list.loanProduct === productType) {
    //                 loanPurposeObj.push(list);
    //             }
    //         });
    //         return loanPurposeObj;
    //     }
    // }

    getLoanPurposeList() {
        let lookupData = this.getLookupFromStorage();
        if (lookupData) {
            return lookupData.COMMON_Loan_Purpose;
        } else {
            return mdmData.COMMON_Loan_Purpose;
        }
    }


    getLoanTermsOnLoanType() {
        let lookupData = this.getLookupFromStorage();

        if (lookupData) {
            return lookupData.COMMON_Loan_Terms;
        } else {
            return mdmData.COMMON_Loan_Terms;
        }
    }

    getFinanceTypeList() {
        try {
            let lookupData = this.getLookupFromStorage();
            if (lookupData) {
                return lookupData.COMMON_Finance_Type;
            } else {
                return mdmData.COMMON_Finance_Type;
            }
        }
        catch (exception) {
            console.log(exception.message);
        }
    }

    getCollateralTypeList() {
        try {
            let lookupData = this.getLookupFromStorage();
            if (lookupData) {
                return lookupData.COMMON_Collateral_Type;
            } else {
                return mdmData.COMMON_Collateral_Type;
            }
        }
        catch (exception) {
            console.log(exception.message)
        }
    }

    getAutoDebitList() {
        try {
            let lookupData = this.getLookupFromStorage();
            if (lookupData) {
                return lookupData.COMMON_AUTO_DEBIT_LOAN_CODE_LIST;
            } else {
                return mdmData.COMMON_AUTO_DEBIT_LOAN_CODE_LIST;
            }
        }
        catch (exception) {
            console.log(exception.message)
        }
    }

    getConditionTypeList() {
        try {
            let lookupData = this.getLookupFromStorage();
            if (lookupData) {
                return lookupData.COMMON_Vehicle_Type;
            } else {
                return mdmData.COMMON_Vehicle_Type;
            }
        }
        catch (exception) {
            console.log(exception.message)
        }
    }

    getMonths() {
        try {
            let months = [];
            for (let i = 0; i < 12; i++)
                months.push("" + i + "");
            return months;
        }
        catch (exception) {
            console.log(exception.message)
        }
    }

    getYears() {
        try {
            let years = [];
            for (let i = 0; i < 100; i++)
                years.push("" + i + "");
            return years;
        }
        catch (exception) {
            console.log(exception.message)
        }
    }

    getDependentList() {
        try {
            let lookupData = this.getLookupFromStorage();
            if (Object.keys(lookupData).length) {
                return lookupData.COMMON_DependentList;
            }
            return mdmData.COMMON_DependentList;
        }
        catch (exception) {
            console.log(exception.message)
        }
    }

    getTerm() {
        try {
            let years = [];
            for (let i = 0; i <= 360; i++)
                years.push("" + i + "");
            return years;
        }
        catch (exception) {
            console.log(exception.message)
        }
    }


    getLoanTerm() {
        try {
            let lookupData = this.getLookupFromStorage();
            if (lookupData) {
                return lookupData.COMMON_Loan_Terms;
            } else {
                return mdmData.COMMON_Loan_Terms;
            }
        }
        catch (exception) {
            console.log(exception.message)
        }
    }

    getLookupData(processName): Observable<any> {
        try {
            //if mocking enabled
            if (environment.isMockingEnabled) {
                return this.http.get('assets/resources/mocks/mdm.json');
            }
            //api call
            else {
                return this.http.get<any>(environment.apiURL + "/lookup/master" + '?processName=' + processName)
                    .pipe(map(response => {
                        return response;
                    }));
            }
        } catch (exception) {
            console.log(exception.message)
        }

    }

    getValidationValues() {
        try {
            return require('../../../assets/validators/journey/validation-values.json');
        }
        catch (exception) {
            console.log(exception.message)
        }
    }

    getEmpType() {
        try {
            let lookupData = this.getLookupFromStorage();
            if (lookupData) {
                return lookupData.COMMON_Employment_Type;
            } else {
                return mdmData.COMMON_Employment_Type;
            }
        }
        catch (exception) {
            console.log(exception.message)
        }
    }

    getIssueingCountry() {
        try {
            let lookupData = this.getLookupFromStorage();
            this.country_MasterModified = [];
            this.obj = [];
            if (lookupData) {
                this.country_Master = lookupData.COMMON_Country;
                this.country_Master.forEach((data) => {
                    if (data.code === 'NG_112') {
                        this.obj = data;
                    } else {
                        this.country_MasterModified.push(data);
                    }
                })

                this.country_MasterModified.unshift(this.obj);
                return this.country_MasterModified;
            } else {
                return mdmData.COMMON_Country;
            }
        }
        catch (exception) {
            console.log(exception.message)
        }
    }

    getMaritalStatus() {
        try {
            let lookupData = this.getLookupFromStorage();
            if (lookupData) {
                return lookupData.COMMON_MaritalStatus;
            }
        }
        catch (exception) {
            console.log(exception.message)
        }
    }

    getReferralSourceList() {
        try {
            let lookupData = this.getLookupFromStorage();
            if (lookupData) {
                return lookupData.REFERRAL_SOURCE;
            }
        }
        catch (exception) {
            console.log(exception.message)
        }
    }

    getOccupationList() {
        try {
            let lookupData = this.getLookupFromStorage();
            if (lookupData) {
                return lookupData.COMMON_OCCUPATION;
            } else {
                return mdmData.COMMON_OCCUPATION;
            }
        }
        catch (exception) {

            console.log(exception.message)
        }



    }

    getBusinessType() {
        try {
            let lookupData = this.getLookupFromStorage();
            if (lookupData) {
                return lookupData.COMMON_BUSINESS_TYPE;
            } else {
                return mdmData.COMMON_BUSINESS_TYPE;
            }
        }
        catch (exception) {
            console.log(exception.message)
        }
    }

    getJobTitleList() {
        try {
            let lookupData = this.getLookupFromStorage();
            if (lookupData) {
                return lookupData.COMMON_JOB_TITLE;
            } else {
                return mdmData.COMMON_JOB_TITLE;
            }
        }
        catch (exception) {
            console.log(exception.message)
        }
    }

    getAccountRelationship() {
        try {
            let lookupData = this.getLookupFromStorage();
            if (Object.keys(lookupData).length) {
                return lookupData.COMMON_RELATIONSHIP;
            }
        }
        catch (exception) {
            console.log(exception.message)
        }
    }

    getMasterDocumentList() {
        try {
            let lookupData = this.getLookupFromStorage();
            if (Object.keys(lookupData).length) {
                return lookupData.COMMON_DOC_TYPES;
            }
            return mdmData.COMMON_DOC_TYPES;
        }
        catch (exception) {
            console.log(exception.message)
        }
    }

    getEmpSectorList() {
        let lookupData = this.getLookupFromStorage();
        if (lookupData) {
            return lookupData.COMMON_EMP_SECTOR;
        } else {
            return mdmData.COMMON_EMP_SECTOR;
        }
    }

    getIncomeSourceList() {
        let lookupData = this.getLookupFromStorage();
        if (lookupData) {
            return lookupData.COMMON_GENDER_TYPE;
        } else {
            return mdmData.COMMON_GENDER_TYPE;
        }
    }

    getHighestEducationList() {
        let lookupData = this.getLookupFromStorage();
        if (lookupData) {
            return lookupData.EDUCATION_TYPES;
        } else {
            return mdmData.EDUCATION_TYPES;
        }
    }

    getGender() {
        let lookupData = this.getLookupFromStorage();
        if (lookupData) {
            return lookupData.COMMON_GENDER_TYPE;
        } else {
            return mdmData.COMMON_GENDER_TYPE;
        }
    }

    getSuffix() {
        let lookupData = this.getLookupFromStorage();
        if (lookupData) {
            return lookupData.COMMON_Suffix;
        } else {
            return mdmData.COMMON_Suffix;
        }
    }

    getPrefix() {
        let lookupData = this.getLookupFromStorage();
        if (lookupData) {
            return lookupData.COMMON_Prefix;
        } else {
            return mdmData.COMMON_Prefix;
        }
    }

    getPEPRelationList() {
        let lookupData = this.getLookupFromStorage();
        if (lookupData) {
            return lookupData.COMMON_PEP_RELATIONSHIP;
        } else {
            return mdmData.COMMON_PEP_RELATIONSHIP;
        }
    }

    getAllowedAgeList() {
        let lookupData = this.getLookupFromStorage();
        if (lookupData) {
            return lookupData.MIN_MAX_AGES;
        } else {
            return mdmData.MIN_MAX_AGES;
        }
    }

    getestimatedAmountList() {
        let lookupData = this.getLookupFromStorage();
        if (lookupData) {
            return lookupData.COMMON_ESTIMATE_AMOUNT;
        } else {
            return mdmData.COMMON_ESTIMATE_AMOUNT;
        }
    }

    getBranchList() {
        let lookupData = this.getLookupFromStorage();
        if (lookupData) {
            return lookupData.COMMON_BranchList;
        } else {
            return mdmData.COMMON_BranchList;
        }
    }


    getCurrencyList() {
        let lookupData = this.getLookupFromStorage();
        if (lookupData) {
            return lookupData.COMMON_CURRENCY_TYPE;
        } else {
            return mdmData.COMMON_CURRENCY_TYPE;
        }
    }

    getCardType() {

        let lookupData = this.getLookupFromStorage();
        if (lookupData) {
            return lookupData.COMMON_Card_Type;
        } else {
            return mdmData.COMMON_Card_Type;
        }
    }

    getIDType() {
        let lookupData = this.getLookupFromStorage();
        if (lookupData) {
            return lookupData.COMMON_IDType;
        } else {
            return mdmData.COMMON_IDType;
        }

    }


    getrelationship() {
        let lookupData = this.getLookupFromStorage();
        if (lookupData) {
            return lookupData.COMMON_RELATIONSHIP;
        } else {
            return mdmData.COMMON_RELATIONSHIP;
        }
    }

    getFamilyRelationship() {
        let lookupData = this.getLookupFromStorage();
        if (lookupData) {
            return lookupData.COMMON_FamilyRelationship;
        } else {
            return mdmData.COMMON_FamilyRelationship;
        }
    }

    getOptionList() {
        let lookupData = this.getLookupFromStorage();
        if (lookupData) {
            return lookupData.COMMON_OPTION_TYPE;
        } else {
            return mdmData.COMMON_OPTION_TYPE;
        }
    }
    getCountyFromState(state) {
        let lookupData = this.getLookupFromStorage();
        // let stateName = lookupData.ADDRESS_State.find(st => st.code === state);
        let _countyState = lookupData.ADDRESS_CountyState.filter(cs => cs.conditionalField === state);
        let countyObj =
        {
            countyList: _countyState//lookupData.ADDRESS_County.filter(county => county.code === _countyState.code)
        }
        // { countyList: [] };
        // countyObj.countyList = _countyState;
        return countyObj;
    }
    getEmpStatus() {
        let lookupData = this.getLookupFromStorage();
        if (lookupData) {
            return lookupData.EMPLOYMENT_Employment_Status;
        } else {
            return mdmData.EMPLOYMENT_Employment_Status;
        }

    }

    getIncomeType() {
        let lookupData = this.getLookupFromStorage();
        if (lookupData) {
            return lookupData.COMMON_INCOME_TYPE;
        } else {
            return mdmData.COMMON_INCOME_TYPE;
        }

    }

    getIncomeFrequency() {
        let lookupData = this.getLookupFromStorage();
        if (lookupData) {
            return lookupData.COMMON_Income_Frequency;
        } else {
            return mdmData.COMMON_Income_Frequency;
        }

    }

    getAssetType() {
        let lookupData = this.getLookupFromStorage();
        if (lookupData) {
            return lookupData.COMMON_Asset_Type;
        } else {
            return mdmData.COMMON_Asset_Type;
        }
    }

    getState() {
        let lookupData = this.getLookupFromStorage();
        if (lookupData) {
            return lookupData.COMMON_STATE;
        } else {
            return mdmData.COMMON_STATE;
        }

    }

    getCity() {
        let lookupData = this.getLookupFromStorage();
        if (lookupData) {
            return lookupData.ADDRESS_CITY;
        } else {
            return mdmData.ADDRESS_CITY;
        }
    }

    getCounty() {
        let lookupData = this.getLookupFromStorage();
        if (lookupData) {
            return lookupData.ADDRESS_County;
        } else {
            return mdmData.ADDRESS_County;
        }

    }

    getCountyState() {
        let lookupData = this.getLookupFromStorage();
        if (lookupData) {
            return lookupData.ADDRESS_CountyState;
        } else {
            return mdmData.ADDRESS_CountyState;
        }

    }

    getIssueingState() {
        let lookupData = this.getLookupFromStorage();
        if (lookupData) {
            return lookupData.ADDRESS_State;
        } else {
            return mdmData.ADDRESS_State;
        }

    }

    getBankingCenter() {
        let lookupData = this.getLookupFromStorage();
        if (lookupData) {
            return lookupData.BRANCH_NAME_DETAILS;
        } else {
            return mdmData.BRANCH_NAME_DETAILS;
        }
    }

    getFinancialThreshold(collateralType) {
        let lookupData = this.getLookupFromStorage();
        if (lookupData) {
            return lookupData.COMMON_Collateral_Type_Min_Max_Laon_Amount.filter(element => {
                return (element.code === collateralType)
            })[0].finThreshold;
        }
        return null;
    }

    getPhoneType() {
        let lookupData = this.getLookupFromStorage();
        if (lookupData) {
            return lookupData.ADDRESS_Phone_Type;
        } else {
            return mdmData.ADDRESS_Phone_Type;
        }

    }

    getownOrRent() {
        let lookupData = this.getLookupFromStorage();
        if (lookupData) {
            return lookupData.COMMON_RENT_OPTION;
        } else {
            return mdmData.COMMON_RENT_OPTION;
        }
    }


    getBranchCenterList() {
        let lookupData = this.getLookupFromStorage();
        if (lookupData) {
            return lookupData.COMMON_BRANCH_NAMES;
        } else {
            return mdmData.COMMON_BRANCH_NAMES;
        }
    }

    saveData(data): Observable<any> {
        return this.http.post<any>(environment.apiURL + "/api/applications/", data, this.httpOptions)
            .pipe(map(response => {
                return response;
            }
            ));
    }



    ibps(arn): Observable<any> {
        return this.http.post<any>(environment.apiURL + "/api/ibps/applications?arn=" + arn, this.httpOptions)
            .pipe(map(response => {
                return response;
            }
            ));
    }

    isTouchDevice() {
        return 'ontouchstart' in window // works on most browsers
            ||
            navigator.maxTouchPoints; // works on IE10/11 and Surface
    };

    checkAutoDebit(event) {
        let autoDebitList = this.getAutoDebitList();
        let isAutoDebitFieldExist = [];
        isAutoDebitFieldExist = autoDebitList.filter((element) => {
            return element.code === event;
        });
        if (isAutoDebitFieldExist.length > 0) {
            return true;
        }
        else {
            return false;
        }
    }


    deleteData(arn, id): Observable<any> {
        return this.http.delete(environment.apiURL + "/api/applications/" + arn + "/applicants/" + id, this.httpOptions)
            .pipe(map(response => {
                return response;
            }
            ));
    }

    extractIdScanData(data): Observable<any> {
        let arn = this.getFromStorage().arn;
        return this.http.post("http://104.215.136.56:9099/api/externalservice/documents/IDSCAN?arn=" + arn, data)
            .pipe(map(response => {
                return response;
            }
            ));
    }

    getUSPSData(data) {
        let arn = this.getFromStorage().arn;
        return this.http.post(environment.apiURL + "/api/externalservice/address/USPS?arn=" + arn, data)
            .pipe(map(response => {
                return response;
            }
            ));
    }

    updateData(data): Observable<any> {
        let arn = this.getARNFromStorage();
        return this.http.post<any>(environment.apiURL + "/api/applications/" + arn + "/addFinancialInfo", data.appData, this.httpOptions)
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

    saveAndExitApplication(data): Observable<any> {
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
            action: data.actionType
        };
        let appData = this.getFromStorage();
        let applicant = appData.applicants.find(app => app.id == data.applicant.id);
        let apiUrl = "";
        apiUrl = environment.apiURL + '/api/applications/' + data.arn + "/applicants?context=" + data.tabName;
        return this.http.post(apiUrl, data.applicant, this.httpOptions)
            .pipe(map(response => {
                this.savePreference({
                    lastVisitedPage: data.context,
                    visitorIP: null,
                    saveFlag: data.saveFlag
                }).subscribe(response => {

                });
                return response;
            }));
    }

    deleteApplicantDetails(data): Observable<any> {
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
            action: data.actionType
        };
        let apiUrl = "";
        apiUrl = environment.apiURL + '/api/applications/' + data.arn + "/applicants?context=" + data.tabName;
        return this.http.post(apiUrl, data.applicant, this.httpOptions)
            .pipe(map(response => {
                return response;
            }));
    }

    saveConsent(data): Observable<any> {
        let arn = this.getARNFromStorage();
        return this.http.post<any>(environment.apiURL + "/api/applications/" + arn + "/saveConsent", data.appData, this.httpOptions)
            .pipe(map(response => {
                this.savePreference({
                    lastVisitedPage: data.context,
                    visitorIP: null,
                    saveFlag: data.saveFlag
                }).subscribe(response => {

                });
                return response;
            }));
    }

    savePreference(data) {
        let arn = this.getFromStorage().arn;
        let preferenceData = {
            "lastVisitedPage": data.lastVisitedPage,
            "visitorIP": null
        }
        return this.http.post(environment.apiURL + "/api/applications/" + arn + "/" + "PREFERENCES/" + data.saveFlag, preferenceData, this.httpOptions)
            .pipe(map(response => {
                return response;
            }
            ));
    }


    getUploadedDocuments() {
        let application = this.getFromStorage();
        let applicant = this.getPrimaryApplicant();
        if (applicant && applicant.documents) {
            let documents = applicant.documents.map((item) => {
                return {
                    docTypeCode: item.docTypeCode,
                    data: item.images[0].data ? this.appendByteHeader(item.images[0].data, item.images[0].name) : null,
                    ext: item.images[0].ext,
                    name: item.images[0].name,
                    omnidocsKey: item.images[0].omnidocsKey
                }
            });
            return documents;
        } else {
            return null;
        }
        // return this.http.get(environment.apiURL + `/api/applications/${application.arn}/applicants/${applicant.id}/documents/`)
        //     .pipe(map(response => {
        //         return response;
        //         // this.saveApplicant(response);
        //     }
        //     ));
    };

    getCollateralDocs(order?) {
        if (!order) {
            order = 1;
        }
        let application = this.getFromStorage();
        let applicant = application.applicants[order - 1];

        if (applicant.documents) {
            return applicant.documents.filter((item) => {
                return (item.docTypeCode === 'TAX' || item.docTypeCode === 'PERS_FIN' || item.docTypeCode === 'OTHER');
            })
        } else {
            return null;
        }
    };

    getDealerInvoice(order?) {
        if (!order) {
            order = 1;
        }
        let application = this.getFromStorage();
        let applicant = application.applicants[order - 1];

        if (applicant.documents) {
            return applicant.documents.filter((item) => {
                return (item.docTypeCode === 'PUR_INV');
            })
        } else {
            return null;
        }
    };

    getIDScanDocs(payload) {
        if (payload.id) {
            let application = this.getFromStorage();
            let applicant = application.applicants.find(applicant => {
                return applicant.id === payload.id
            });

            if (applicant.documents) {
                return applicant.documents.filter((item) => {
                    return (item.docTypeCode === 'IDSCN');
                })
            } else {
                return null;
            }
        } else {
            return null;
        }
    };

    savePrimaryApplicant(data) {
        let application = this.getFromStorage();
        application.applicants[0] = Object.assign({}, application.applicants[0], data);
        sessionStorage.setItem('JMMB.APP', JSON.stringify(application));
    };

    getImages(documentData) {
        let application = this.getFromStorage();
        let applicant = this.getPrimaryApplicant();
        return this.http.get(environment.apiURL + `/api/applications/${application.arn}/applicants/${applicant.id}/documents/${documentData.images[0].omnidocsKey}`)
            .pipe(map(response => {
                if (response) {
                    return {
                        data: this.appendByteHeader(response['data'], response['name']),
                        ext: response['ext'],
                        name: response['name'],
                        omnidocsKey: response['omnidocsKey'],
                        createdOn: response['createdOn'],
                        docTypeCode: documentData.docTypeCode
                    }
                }
            }));
    };

    appendByteHeader(base64url, imageName) {
        var imageExtn, imageUrl;
        imageExtn = imageName.split('.').pop().toUpperCase();
        switch (imageExtn) {
            case "JPG":
                imageUrl = "data:image/jpg;base64," + base64url;
                break;
            case "JPEG":
                imageUrl = "data:image/jpeg;base64," + base64url;
                break;
            case "PNG":
                imageUrl = "data:image/png;base64," + base64url;
                break;
            case "TIFF":
                imageUrl = "data:image/tiff;base64," + base64url;
                break;
            case "PDF":
                imageUrl = "data:application/pdf;base64," + base64url;
                break;
            case "GIF":
                imageUrl = "data:image/gif;base64," + base64url;
                break;
        }
        return imageUrl;
    };

    getByteData(str) {
        return str.substr(str.indexOf(',') + 1);
    }

    updateDocumentsPayload(payload) {
        let temp = [];
        payload.forEach((item) => {
            temp.push({
                docTypeCode: item.docTypeCode,
                images: [{
                    data: this.getByteData(item.data),
                    ext: item.ext,
                    name: item.name,
                    oldDocKey: item.oldDocKey
                }]
            })
        });
        return temp;
    };

    saveDocuments(payload) {
        let applicant = this.getPrimaryApplicant();
        let id = payload.id ? payload.id : applicant.id;
        payload = this.updateDocumentsPayload(payload.documents);
        let application = this.getFromStorage();
        return this.http.post(environment.apiURL + `/api/applications/${application.arn}/applicants/${id}/documents?metadataOnly=true`, payload)
            .pipe(map(response => {
                this.response = response;
                let index = (application.applicants.find(x => x.id === id).order - 1);
                application.applicants[index].documents = application.applicants[index].documents ? application.applicants[index].documents : [];
                this.response.forEach((document) => {
                    document.images[0].data = null;
                    let ind = application.applicants[index].documents.findIndex((item) => {
                        return item.docTypeCode === document.docTypeCode
                    });
                    if (ind >= 0) {
                        application.applicants[index].documents[ind] = document;
                    } else {
                        application.applicants[index].documents.push(document);
                    }
                })

                sessionStorage.setItem('JMMB.APP', JSON.stringify(application));
            }
            ));
    };

    removeDocuments(payload, id) {
        let application = this.getFromStorage();
        return this.http.post(environment.apiURL + `/api/applications/${application.arn}/applicants/${id}/documents/${payload.omnidocsKey}`, this.httpOptions)
            .pipe(map(response => {
                return response;
            }
            ));
    };

    checkIfDocsUploaded() {
        let applicant = this.getPrimaryApplicant();
        if (applicant.documents) {
            return true;
        } else {
            return false;
        }
    };

    checkForCollateralDocs(order?) {
        let docs = this.getCollateralDocs(order);
        if (!this._dom.isEmpty(docs)) {
            return true;
        } else {
            return false;
        }
    }

    checkForDealerInvoiceDoc(order?) {
        let docs = this.getDealerInvoice(order);
        if (!this._dom.isEmpty(docs)) {
            return true;
        } else {
            return false;
        }
    }

    checkForIDScanDocs(payload) {
        let docs = this.getIDScanDocs(payload);
        if (!this._dom.isEmpty(docs)) {
            return true;
        } else {
            return false;
        }
    }

    saveExperianData(data) {
        let application = this.getFromStorage();
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
            // observe: 'response'
        };
        return this.http.post(environment.apiURL + `/api/externalservice/experian/answers`, data, this.httpOptions)
            .pipe(map((response: any) => {
                return response;
            }
            ));
    }


    getDocumentList() {
        const lookupData = this.getLookupFromStorage();
        if (lookupData) {
            return lookupData.COMMON_DOC_TYPES;
        } else {
            return mdmData.COMMON_DOC_TYPES;
        }
    }
    getLoanProductType() {
        let lookupData = this.getLookupFromStorage();
        if (environment.isMockingEnabled) {
            return lookupData.COMMON_Loan_Product;
        }
        return mdmData.COMMON_Loan_Product;

    }
    getSecurityQuestions() {
        let lookupData = this.getLookupFromStorage();
        if (Object.keys(lookupData).length) {
            return lookupData.SECURITY_QUESTIONS;
        }
        return mdmData.SECURITY_QUESTIONS;
    }

    uploadDocuments(data) {
        let docData = {
            "data": data.data ? data.data : null,
            "docIndex": data.docIndex ? data.docIndex : null,
            "documentName": data.docName ? data.docName : null,
            "documentType": data.docType ? data.docType : null,
            "uploadDate": data.uploadDate ? data.uploadDate : null,
            "id": data.id ? data.id : null,
            "uploadedFor": data.uploadedFor ? data.uploadedFor : '',
            "accountRelationship": data.accountRelationship ? data.accountRelationship : '',
            "nibNumber": data.nibNumber ? data.nibNumber : '',
            "order": data.order ? data.order : null,
            "error": null,
            "workitemNumber": data.workItemNumber ? data.workItemNumber : null
        }
        return this.http.post<any>(environment.apiURL + '/api/applications/' + data.workItemNumber + '/document/upload', docData, this.httpOptions)
            .pipe(map(response => {
                return response;
            }));
    }

    submitDocuments(data): Observable<any> {
        let arn = this.getARNFromStorage()
        return this.http.post<any>(environment.apiURL + "/api/applications/" + arn + "/submitDocuments", data.appData, this.httpOptions)
            .pipe(map(response => {
                // this.savePreference({
                //     arn: data.arn,
                //     lastVisitedPage: data.context,
                //     visitorIP: null,
                //     saveFlag: data.saveFlag
                // }).subscribe(response => {

                // });
                return response;
            }));
    }

    updateDocuments(data): Observable<any> {
        let arn = this.getARNFromStorage()
        return this.http.post<any>(environment.apiURL + "/api/applications/" + arn + "/updateDocuments", data.appData, this.httpOptions)
            .pipe(map(response => {
                return response;
            }));
    }

    //to check if user has se;ected unique id types
    isIdTypeListNotUnique(idList) {
        try {
            if (idList && idList.length > 0) {
                const status = idList.some(element => {
                    let counter = 0;
                    for (const iterator of idList) {
                        if (iterator.idType === element.idType) {
                            counter += 1;
                        }
                    }
                    return counter > 1;
                });
                return status;
            }
        } catch (exception) {
            console.log(exception.message)
        }
    }

    //to check is user selects more than one primary source of income
    hasMultiplePrimaryIncome(incomeList) {
        try {
            if (incomeList && incomeList.length > 0) {
                let counter = 0;

                incomeList.forEach(element => {
                    if (element['primarySourceOfIncome'] === true) {
                        counter += 1;
                    }
                });
                if (counter > 1) {
                    return true;
                } else {
                    return false;
                }
            }
        } catch (exception) {
            console.log(exception.message)
        }
    }

    //if user doesn't select any source of income
    noPrimarySourceOfIncome(incomeList) {
        try {
            if (incomeList && incomeList.length > 0) {
                let counter = 0;

                incomeList.forEach(element => {
                    if (element['primarySourceOfIncome'] === false) {
                        counter += 1;
                    }
                });
                if (counter === incomeList.length) {
                    return true;
                } else {
                    return false;
                }
            }
        } catch (exception) {
            console.log(exception.message)
        }
    }

    //Added by Hemlata for Territory dropdown on 14 Oct 2022
    getTerritoryList() {
        let lookupData = this.getLookupFromStorage();
        if (lookupData) {
            return lookupData.COMMON_TerritoryList;
        } else {
            return mdmData.COMMON_TerritoryList;
        }
    }

    //Added by Hemlata for Area Code dropdown on 16 Oct 2022
    getAreaCodeList() {
        let lookupData = this.getLookupFromStorage();
        if (lookupData) {
            return lookupData.COMMON_AreaCodeList;
        } else {
            return mdmData.COMMON_AreaCodeList;
        }
    }
    //Added by Hemlata for Account Type dropdown on 17 Oct 2022
    getAccountTypeList() {
        let lookupData = this.getLookupFromStorage();
        if (lookupData) {
            return lookupData.COMMON_AccountTypeList;
        } else {
            return mdmData.COMMON_AccountTypeList;
        }
    }

     //Added by Hemlata for Loan Relationship dropdown on 17 Oct 2022
     getLoanRelationshipList() {
        let lookupData = this.getLookupFromStorage();
        if (lookupData) {
            return lookupData.COMMON_LoanRelationshipList;
        } else {
            return mdmData.COMMON_LoanRelationshipList;
        }
    }
    

    //Added by Hemlata for Liability Type dropdown on 17 Oct 2022
    getLiabilityTypeList() {
        let lookupData = this.getLookupFromStorage();
        if (lookupData) {
            return lookupData.COMMON_LiabilityTypeList;
        } else {
            return mdmData.COMMON_LiabilityTypeList;
        }
    }

    //Added by Hemlata for Expense Type dropdown on 17 Oct 2022
    getExpenseTypeList() {
        let lookupData = this.getLookupFromStorage();
        if (lookupData) {
            return lookupData.COMMON_ExpenseTypeList;
        } else {
            return mdmData.COMMON_ExpenseTypeList;
        }
    }
    
}
