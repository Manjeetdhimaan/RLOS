import { Injectable, ApplicationInitStatus } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, of, throwError } from 'rxjs';
import { map } from "rxjs/operators";

//import { environment } from '../../../environments/environment';

import { environment } from 'environments/environment';
import { PersistanceService } from '../../core/services';

declare var require: any;
@Injectable()
export class DocumentsService {

    private CACHE_PREFIX = 'JMMB';

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

    response: any;
    httpOptions;
    httpObserve;
    private subject = new Subject<any>();
    constructor(private persistanceService: PersistanceService, private http: HttpClient) {

        let httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        this.httpOptions = {
            headers: httpHeaders
        };
    }

    getFromStorage() {
        if (sessionStorage.getItem('JMMB.APP')) {
            return JSON.parse(sessionStorage.getItem('JMMB.APP'));
        } else {
            return {
                arn: null
            };
        }
    };

    getDocsConfigFromSession() {
        if (sessionStorage.getItem('JMMB.DOCS.CONFIG')) {
            return JSON.parse(sessionStorage.getItem('JMMB.DOCS.CONFIG'));
        } else {
            return null;
        }
    };

    setConfigInSession(docsConfig) {
        // sessionStorage.setItem('JMMB.DOCS.CONFIG', JSON.stringify(docsConfig));
        let applicants = [];
        let application = this.getFromStorage();
        docsConfig.applicants.forEach(applicant => {
            applicants.push({ id: applicant.id, type: applicant.type, documents: applicant.buckets });
        });
        if (application) {
            application.workItemNumber = docsConfig.workItemNumber;
            application.parentFolderIndex = docsConfig.parentFolderIndex;
            application = Object.assign(application, { applicants: applicants });
        }
        sessionStorage.setItem('JMMB.APP', JSON.stringify(application));
    };

    getPrimaryApplicant() {
        let application = this.getFromStorage();
        if (application.applicants) {
            let applicant = application.applicants.find((item) => {
                return item.type === 'PRIMARY'
            });
            return applicant;
        } else {
            return {
                id: null
            };
        }
    };

    processConfig(config) {
        let buckets = config.documents;
        buckets.forEach((bucket) => {
            bucket.isComponentReadOnly = false;
            switch (bucket.docTypeCode) {
                case 'TAX':
                    bucket.label = 'Tax Document';
                    break;
                case 'OTHER':
                    bucket.label = 'Other Document';
                    break;
                case 'IDSCN':
                    bucket.label = 'Id Document';
                    break;
            }
        });
        return config
    };

    getDocuments() {

    }

    getConfig() {
        let application = this.getFromStorage();
        return this.http.post(environment.apiURL + '/api/ibps/applications/' + application.arn + '/config', application, this.httpOptions)
            .pipe(map(response => {
                if (response)
                    this.setConfigInSession(response);
                return response;
            }
            ));
    };

    getUploadedDocuments(applicantId) {
        let application = this.getFromStorage();
        this.httpObserve = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
            observe: 'response'
        };
        return this.http.post(environment.apiURL + '/api/ibps/applications/' + application.arn + '/applicants/' + applicantId + '/documents', application, this.httpObserve)
            .pipe(map(response => {
                return response;
            }
            ));
    };

    getImages(applicantId, index, documentData?) {
        let application = this.getFromStorage();
        if (documentData.images[index].omnidocsKey) {
            return this.http.post(environment.apiURL + '/api/ibps/applications/' + application.arn + '/applicants/' + applicantId + '/documents/' + documentData.images[index].omnidocsKey + '?arn=' + application.arn, application, this.httpOptions)
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
        }
    };

    getByteData(str) {
        return str.substr(str.indexOf(',') + 1);
    };

    appendByteHeader(base64url, imageName) {
        var imageExtn, imageUrl;
        imageName = (imageName) ? imageName : "abc.png";
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

    updateDocumentsPayload(payload) {
        let temp = [];
        let updatedPayload: any = {};
        updatedPayload.docTypeCode = payload.docTypeCode
        updatedPayload.images = payload.images.map((item) => {
            return {
                data: this.getByteData(item.data),
                ext: item.ext.toUpperCase(),
                name: item.name,
                oldDocKey: item.oldDocKey
            }
        });
        temp.push(updatedPayload);
        return temp;
    };

    getApplicantIndex(id) {
        let application = this.getFromStorage();
        return application.applicants.findIndex((applicant) => {
            return applicant.id.toString() === id.toString();
        })
    }

    getApplicantByIndex(id) {
        let application = this.getFromStorage();
        return application.applicants.filter((applicant) => {
            return applicant.id.toString() === id.toString();
        })
    }

    uploadDocument(data, arn) {
        return this.http.post(environment.apiURL + '/api/applications/' + arn + '/applicants/' + data.applicantId + '/upload', data)
            .pipe(map(response => {
                return response;
            }
            ));
    }

    submitDocument(arn) {
        return this.http.post(environment.apiURL + '/api/ibps/submitDocs?arn=' + arn, this.httpOptions)
            .pipe(map(response => {
                return response;
            }
            ));
    }



    setInStorage(key, value) {
        sessionStorage.setItem(this.CACHE_PREFIX + '.' + key, JSON.stringify(value));
    }

    saveDocuments(payload) {
        let id = payload.applicantId;
        payload = this.updateDocumentsPayload(payload);
        let application = this.getFromStorage();
        let applicantIndex = this.getApplicantIndex(id);
        let ssn = application.applicants[applicantIndex].ssn;
        return this.http.post(environment.apiURL + '/api/ibps/applications/' + application.arn + '/applicants/' + id + '/documents/' + payload[0].docTypeCode + '?workItemNumber=' + application.workItemNumber + '&parentFolderIndex=' + application.parentFolderIndex, payload)
            .pipe(map(response => {
                this.response = response
                application.applicants[applicantIndex].documents = application.applicants[applicantIndex].documents ? application.applicants[applicantIndex].documents : [];
                this.response.forEach((document) => {
                    let docIndex = application.applicants[applicantIndex].documents.findIndex((item) => {
                        return item.docTypeCode === document.docTypeCode
                    });
                    if (docIndex >= 0) {
                        application.applicants[applicantIndex].documents[docIndex] = document;
                    } else {
                        application.applicants[applicantIndex].documents.push(document);
                    }
                })

                sessionStorage.setItem('JMMB.APP', JSON.stringify(application));
                return response;
            }
            ));
    };

    validateAllDocsUploaded(): any {
        let _that = this;
        let verified = true;
        let application = this.getFromStorage();
        let docsConfig = this.getDocsConfigFromSession();

        // docsConfig.forEach(applicantConfig => {
        //     // let applicantObj = this.getApplicantByIndex(applicantConfig.applicantId);
        //     if (verified) {
        //         let result = application.applicants.forEach((applicant) => {
        //             if (verified) {
        //                 if (applicant.documents) {
        //                     applicant.documents.forEach((document) => {
        //                         if (verified) {
        //                             let docIndex;
        //                             let applicantInSession = _that.getApplicantByIndex(applicantConfig.id);
        //                             if (applicantInSession && applicantInSession[0].documents) {
        //                                 docIndex = applicantInSession[0].documents.findIndex((item) => {
        //                                     return item.docTypeCode === document.docTypeCode
        //                                 });
        //                             }
        //                             if (docIndex >= 0) {
        //                                 verified = true;
        //                             } else {
        //                                 verified = false;
        //                                 return false;
        //                             }
        //                         }
        //                     })
        //                 }
        //                 else {
        //                     verified = false;
        //                     return false;
        //                 }
        //             }
        //         })
        //     }
        // });

        application.applicants.forEach(applicant => {
            applicant.documents.forEach(document => {
                if (!document.uploaded) {
                    verified = false;
                    return false;
                }
            });
            if (!verified) {
                return false;
            }
        });
        return verified;
    }

    submitApplication() {
        let application = this.getFromStorage();
        return this.http.post(environment.apiURL + '/api/ibps/applications/' + application.arn + '/SUBMIT', application)
            .pipe(map(response => {
                return response;
            }
            ));
    }

    deleteDocument(payload, applicantId) {
        let application = this.getFromStorage();
        let applicant = application.applicants.filter(x => x.id === applicantId)[0];
        return this.http.post(environment.apiURL + `/api/ibps/applications/${application.arn}/applicants/${applicant.id}/documents/${payload.docTypeCode}?workItemNumber=${application.workItemNumber}&documentIndex=${payload.imageData.data.documentIndex}&rootFolderIndex=${payload.imageData.data.rootFolderIndex}`, payload)
            .pipe(map(response => {
                // this.saveApplicant(response);
                return response;
            }
            ));
    };

    modifyDto(workItemNumber, applicant) {
        applicant.document = [];
        let documetList = this.getDocumentList();
        documetList.forEach(element => {
            var docData = {
                'docType': element.code,
                'label': element.label,
                'isComponentReadOnly': false,
                'applicantId': applicant.id,
                'workItemNumber': workItemNumber
            }
            applicant.document.push(docData);
        });
        return applicant;
    }


    getDocumentList() {
        const lookupData = this.getLookupFromStorage();
        if (lookupData) {
            return lookupData.COMMON_DOC_TYPES;
        }
    }

    getLookupFromStorage() {
        if (sessionStorage.getItem('lookupData')) {
            return JSON.parse(sessionStorage.getItem('lookupData'));
        } else {
            return {};
        }
    }


}
